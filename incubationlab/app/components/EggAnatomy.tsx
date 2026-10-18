"use client";

import { useEffect, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  DataTexture,
  DoubleSide,
  MathUtils,
  MeshPhysicalMaterial,
  RGBAFormat,
  TubeGeometry,
  Vector3,
} from "three";
import type { EggLayerId, EggLayers } from "./EggViewer";
import OrganicEmbryo from "./OrganicEmbryo";

type EggAnatomyProps = {
  day: number;
  ovoscopy: boolean;
  sectioned: boolean;
  hatching: boolean;
  showInternals: boolean;
  layers: EggLayers;
  selectedLayer: EggLayerId;
  onSelectLayer: (layer: EggLayerId) => void;
};

type SurfaceOptions = {
  sectioned: boolean;
  hatching?: boolean;
  scale: number;
  thickness?: number;
  segments?: number;
};

type VesselPath = {
  points: [number, number, number][];
  radius: number;
};

const OPENING_HALF_ANGLE = 1.1;
const YOLK_CENTER: [number, number, number] = [-0.22, -0.28, -0.1];
const YOLK_RADII: [number, number, number] = [0.39, 0.44, 0.3];

function smooth(start: number, end: number, day: number) {
  const t = MathUtils.clamp((day - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
}

function createNoiseTexture(size: number, base: number, variation: number, seedStart: number) {
  const pixels = new Uint8Array(size * size * 4);
  let seed = seedStart;
  for (let index = 0; index < pixels.length; index += 4) {
    seed = (seed * 16807) % 2147483647;
    const value = MathUtils.clamp(
      base + (seed / 2147483647 - 0.5) * variation,
      0,
      255,
    );
    pixels[index] = pixels[index + 1] = pixels[index + 2] = value;
    pixels[index + 3] = 255;
  }
  const texture = new DataTexture(pixels, size, size, RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

function makeGeometry(positions: number[], indices: number[]) {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function eggPoint(latitude: number, theta: number, scale: number, inset = 0) {
  const sinLatitude = Math.sin(latitude);
  const width = 1 - 0.16 * sinLatitude;
  const radial = Math.max(0.002, Math.cos(latitude) * scale - inset);
  return [
    Math.sin(theta) * radial * width * 0.79,
    sinLatitude * 1.12 * scale,
    Math.cos(theta) * radial * width * 0.72,
  ] as [number, number, number];
}

function createEggWallGeometry({
  sectioned,
  hatching = false,
  scale,
  thickness = 0.02,
  segments = 80,
}: SurfaceOptions) {
  const latitudeCount = Math.max(36, Math.round(segments * 0.68));
  const thetaCount = segments;
  const startTheta = sectioned ? OPENING_HALF_ANGLE : 0;
  const endTheta = sectioned ? Math.PI * 2 - OPENING_HALF_ANGLE : Math.PI * 2;
  const positions: number[] = [];
  const indices: number[] = [];
  const stride = thetaCount + 1;
  const outerStart = 0;
  const innerStart = (latitudeCount + 1) * stride;

  for (let surface = 0; surface < 2; surface += 1) {
    const inset = surface === 0 ? 0 : thickness;
    const offset = surface === 0 ? outerStart : innerStart;
    for (let latitude = 0; latitude <= latitudeCount; latitude += 1) {
      const phi = -Math.PI / 2 + (latitude / latitudeCount) * Math.PI;
      for (let thetaIndex = 0; thetaIndex <= thetaCount; thetaIndex += 1) {
        const theta = startTheta + (thetaIndex / thetaCount) * (endTheta - startTheta);
        positions.push(...eggPoint(phi, theta, scale, inset));
      }
    }
    for (let latitude = 0; latitude < latitudeCount; latitude += 1) {
      for (let thetaIndex = 0; thetaIndex < thetaCount; thetaIndex += 1) {
        const phi = -Math.PI / 2 + ((latitude + 0.5) / latitudeCount) * Math.PI;
        const theta = startTheta + ((thetaIndex + 0.5) / thetaCount) * (endTheta - startTheta);
        const angleFromFront = Math.min(theta, Math.PI * 2 - theta);
        const hatchOpening =
          hatching &&
          ((phi + 0.94) / 0.2) ** 2 + (angleFromFront / 0.42) ** 2 < 1;
        if (hatchOpening) continue;
        const a = offset + latitude * stride + thetaIndex;
        const b = a + stride;
        if (surface === 0) indices.push(a, a + 1, b, a + 1, b + 1, b);
        else indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }

  if (sectioned && thickness > 0) {
    for (const thetaIndex of [0, thetaCount]) {
      for (let latitude = 0; latitude < latitudeCount; latitude += 1) {
        const outerA = outerStart + latitude * stride + thetaIndex;
        const outerB = outerA + stride;
        const innerA = innerStart + latitude * stride + thetaIndex;
        const innerB = innerA + stride;
        indices.push(outerA, innerA, outerB, innerA, innerB, outerB);
      }
    }
  }

  return makeGeometry(positions, indices);
}

function createEggSurfaceGeometry(sectioned: boolean, scale: number, segments = 72) {
  const latitudeCount = Math.max(36, Math.round(segments * 0.68));
  const thetaCount = segments;
  const startTheta = sectioned ? OPENING_HALF_ANGLE : 0;
  const endTheta = sectioned ? Math.PI * 2 - OPENING_HALF_ANGLE : Math.PI * 2;
  const positions: number[] = [];
  const indices: number[] = [];
  const stride = thetaCount + 1;

  for (let latitude = 0; latitude <= latitudeCount; latitude += 1) {
    const phi = -Math.PI / 2 + (latitude / latitudeCount) * Math.PI;
    for (let thetaIndex = 0; thetaIndex <= thetaCount; thetaIndex += 1) {
      const theta = startTheta + (thetaIndex / thetaCount) * (endTheta - startTheta);
      positions.push(...eggPoint(phi, theta, scale));
    }
  }
  for (let latitude = 0; latitude < latitudeCount; latitude += 1) {
    for (let thetaIndex = 0; thetaIndex < thetaCount; thetaIndex += 1) {
      const a = latitude * stride + thetaIndex;
      const b = a + stride;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  return makeGeometry(positions, indices);
}

function createEllipsoidGeometry(
  radii: [number, number, number],
  center: [number, number, number] = [0, 0, 0],
  longitudeSegments = 48,
  latitudeSegments = 32,
) {
  const positions: number[] = [];
  const indices: number[] = [];
  for (let latitude = 0; latitude <= latitudeSegments; latitude += 1) {
    const phi = (latitude / latitudeSegments) * Math.PI;
    for (let longitude = 0; longitude <= longitudeSegments; longitude += 1) {
      const theta = (longitude / longitudeSegments) * Math.PI * 2;
      const organicRipple =
        1 +
        0.009 * Math.sin(theta * 7 + phi * 3) * Math.sin(phi * 5 - theta * 2);
      positions.push(
        center[0] + Math.sin(phi) * Math.cos(theta) * radii[0] * organicRipple,
        center[1] + Math.cos(phi) * radii[1] * organicRipple,
        center[2] + Math.sin(phi) * Math.sin(theta) * radii[2] * organicRipple,
      );
    }
  }
  for (let latitude = 0; latitude < latitudeSegments; latitude += 1) {
    for (let longitude = 0; longitude < longitudeSegments; longitude += 1) {
      const a = latitude * (longitudeSegments + 1) + longitude;
      const b = a + longitudeSegments + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  return makeGeometry(positions, indices);
}

function curveGeometry(
  points: [number, number, number][],
  radius: number,
  segments = 40,
  tipRatio = 0.12,
) {
  const curve = new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z)));
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const indices: number[] = [];
  const sides = 8;
  for (let ring = 0; ring <= segments; ring += 1) {
    const t = ring / segments;
    const center = curve.getPointAt(t);
    const taper = Math.max(0.0007, radius * MathUtils.lerp(1, tipRatio, t) * (1 + 0.12 * Math.sin(Math.PI * t)));
    for (let side = 0; side <= sides; side += 1) {
      const angle = (side / sides) * Math.PI * 2;
      const point = center
        .clone()
        .addScaledVector(frames.normals[ring], Math.cos(angle) * taper)
        .addScaledVector(frames.binormals[ring], Math.sin(angle) * taper);
      positions.push(point.x, point.y, point.z);
    }
  }
  for (let ring = 0; ring < segments; ring += 1) {
    for (let side = 0; side < sides; side += 1) {
      const a = ring * (sides + 1) + side;
      const b = a + sides + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  return makeGeometry(positions, indices);
}

function useDispose(geometries: BufferGeometry[]) {
  useEffect(
    () => () => geometries.forEach((geometry) => geometry.dispose()),
    [geometries],
  );
}

function ShellRim({ color }: { color: string }) {
  const geometry = useMemo(() => {
    const paths = [OPENING_HALF_ANGLE, Math.PI * 2 - OPENING_HALF_ANGLE].map((theta) =>
      Array.from({ length: 45 }, (_, index) => {
        const phi = -Math.PI / 2 + (index / 44) * Math.PI;
        return eggPoint(phi, theta, 1.003);
      }),
    );
    const vertices: number[] = [];
    const indices: number[] = [];
    for (const path of paths) {
      const curve = new CatmullRomCurve3(path.map(([x, y, z]) => new Vector3(x, y, z)));
      const frames = curve.computeFrenetFrames(44, false);
      const start = vertices.length / 3;
      for (let ring = 0; ring <= 44; ring += 1) {
        const center = curve.getPointAt(ring / 44);
        for (let side = 0; side <= 7; side += 1) {
          const angle = (side / 7) * Math.PI * 2;
          const point = center
            .clone()
            .addScaledVector(frames.normals[ring], Math.cos(angle) * 0.012)
            .addScaledVector(frames.binormals[ring], Math.sin(angle) * 0.012);
          vertices.push(point.x, point.y, point.z);
        }
      }
      for (let ring = 0; ring < 44; ring += 1) {
        for (let side = 0; side < 7; side += 1) {
          const a = start + ring * 8 + side;
          const b = a + 8;
          indices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
    return makeGeometry(vertices, indices);
  }, []);
  const disposable = useMemo(() => [geometry], [geometry]);
  useDispose(disposable);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );
}

function HatchRim() {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 64 }, (_, index) => {
      const angle = (index / 64) * Math.PI * 2;
      return eggPoint(
        -0.94 + Math.cos(angle) * 0.2,
        Math.sin(angle) * 0.42,
        1.003,
      );
    });
    const curve = new CatmullRomCurve3(
      points.map(([x, y, z]) => new Vector3(x, y, z)),
      true,
      "centripetal",
    );
    return new TubeGeometry(curve, 96, 0.014, 8, true);
  }, []);
  const disposable = useMemo(() => [geometry], [geometry]);
  useDispose(disposable);

  return (
    <mesh geometry={geometry} renderOrder={7}>
      <meshPhysicalMaterial color="#d3c09c" roughness={0.78} />
    </mesh>
  );
}

function EggShell({
  sectioned,
  hatching,
  ovoscopy,
  selected,
  onSelect,
}: {
  sectioned: boolean;
  hatching: boolean;
  ovoscopy: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const geometry = useMemo(
    () => createEggWallGeometry({
      sectioned,
      hatching,
      scale: 1,
      thickness: 0.024,
      segments: 84,
    }),
    [hatching, sectioned],
  );
  const disposable = useMemo(() => [geometry], [geometry]);
  const bumpMap = useMemo(() => createNoiseTexture(256, 128, 38, 47), []);
  useEffect(() => () => bumpMap.dispose(), [bumpMap]);
  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: selected ? "#fff5de" : ovoscopy ? "#d6a877" : "#e9dfca",
        roughness: 0.78,
        metalness: 0,
        bumpMap,
        bumpScale: 0.018,
        clearcoat: 0.08,
        side: DoubleSide,
        transparent: ovoscopy || !sectioned || hatching,
        opacity: ovoscopy ? 0.14 : sectioned ? 1 : 0.14,
        depthWrite: sectioned && !ovoscopy && !hatching,
      }),
    [bumpMap, hatching, ovoscopy, sectioned, selected],
  );
  useEffect(() => () => material.dispose(), [material]);
  useDispose(disposable);

  return (
    <group
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <mesh geometry={geometry} renderOrder={6}>
        <primitive object={material} attach="material" />
      </mesh>
      {sectioned && !hatching && <ShellRim color={selected ? "#f2d19b" : "#d3c09c"} />}
      {hatching && <HatchRim />}
    </group>
  );
}

function ShellMembranes({
  sectioned,
  hatching,
  ovoscopy,
  onSelect,
}: {
  sectioned: boolean;
  hatching: boolean;
  ovoscopy: boolean;
  onSelect: () => void;
}) {
  const first = useMemo(
    () => createEggWallGeometry({ sectioned, hatching, scale: 0.984, thickness: 0.006, segments: 72 }),
    [hatching, sectioned],
  );
  const second = useMemo(
    () => createEggWallGeometry({ sectioned, hatching, scale: 0.969, thickness: 0.005, segments: 72 }),
    [hatching, sectioned],
  );
  const disposable = useMemo(() => [first, second], [first, second]);
  useDispose(disposable);

  return (
    <group
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <mesh geometry={first} renderOrder={5}>
        <meshPhysicalMaterial
          color={ovoscopy ? "#d2bd9c" : "#c9c2b4"}
          roughness={0.45}
          transparent
          opacity={0.34}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={second} renderOrder={5}>
        <meshPhysicalMaterial
          color="#d8e1d8"
          roughness={0.32}
          transparent
          opacity={0.23}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Albumen({
  sectioned,
  onSelect,
  selected,
}: {
  sectioned: boolean;
  onSelect: () => void;
  selected: boolean;
}) {
  const geometry = useMemo(() => createEggSurfaceGeometry(sectioned, 0.952), [sectioned]);
  const disposable = useMemo(() => [geometry], [geometry]);
  useDispose(disposable);
  return (
    <mesh
      geometry={geometry}
      renderOrder={1}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <meshPhysicalMaterial
        color={selected ? "#e7fff1" : "#d7e8dc"}
        roughness={0.16}
        clearcoat={0.18}
        transparent
        opacity={selected ? 0.17 : 0.11}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function YolkContents({
  day,
  ovoscopy,
  selected,
  onSelect,
}: {
  day: number;
  ovoscopy: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const growth = MathUtils.lerp(1, 0.23, smooth(4, 21, day));
  const radii: [number, number, number] = [
    YOLK_RADII[0] * growth,
    YOLK_RADII[1] * growth,
    YOLK_RADII[2] * growth,
  ];
  const [radiusX, radiusY, radiusZ] = radii;
  const sacGeometry = useMemo(
    () => createEllipsoidGeometry([radiusX + 0.028, radiusY + 0.025, radiusZ + 0.026], YOLK_CENTER),
    [radiusX, radiusY, radiusZ],
  );
  const yolkGeometry = useMemo(
    () => createEllipsoidGeometry([radiusX, radiusY, radiusZ], YOLK_CENTER),
    [radiusX, radiusY, radiusZ],
  );
  const disposable = useMemo(() => [sacGeometry, yolkGeometry], [sacGeometry, yolkGeometry]);
  useDispose(disposable);

  return (
    <group
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <mesh geometry={sacGeometry} renderOrder={2}>
        <meshPhysicalMaterial
          color="#edcf83"
          roughness={0.42}
          clearcoat={0.12}
          transparent
          opacity={0.26 + smooth(2, 12, day) * 0.12}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={yolkGeometry} renderOrder={2}>
        <meshPhysicalMaterial
          color={selected ? "#ffd96b" : ovoscopy ? "#d49b3d" : "#e5b64d"}
          roughness={0.52}
          clearcoat={0.08}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Chalazae({ onSelect }: { onSelect: () => void }) {
  const geometries = useMemo(
    () =>
      [-1, 1].map((side) => {
        const points = Array.from({ length: 21 }, (_, index) => {
          const t = index / 20;
          const angle = t * Math.PI * 3;
          return [
            YOLK_CENTER[0] + Math.sin(angle) * 0.035,
            YOLK_CENTER[1] + side * (0.2 + t * 0.38),
            YOLK_CENTER[2] + Math.cos(angle) * 0.027,
          ] as [number, number, number];
        });
        return curveGeometry(points, 0.013, 48);
      }),
    [],
  );
  useDispose(geometries);
  return (
    <group
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {geometries.map((geometry, index) => (
        <mesh geometry={geometry} key={index}>
          <meshPhysicalMaterial color="#e5dfcb" roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}

function createVesselPaths(day: number): VesselPath[] {
  const yolkGrowth = MathUtils.lerp(1, 0.23, smooth(4, 21, day));
  const radii: [number, number, number] = [
    YOLK_RADII[0] * yolkGrowth,
    YOLK_RADII[1] * yolkGrowth,
    YOLK_RADII[2] * yolkGrowth,
  ];
  const surfacePoint = (u: number, v: number): [number, number, number] => {
    const length = Math.hypot(u, v);
    const factor = length > 0.94 ? 0.94 / length : 1;
    const x = u * factor;
    const y = v * factor;
    return [
      YOLK_CENTER[0] + x * radii[0],
      YOLK_CENTER[1] + y * radii[1],
      YOLK_CENTER[2] + Math.sqrt(Math.max(0, 1 - x * x - y * y)) * radii[2] + 0.009,
    ];
  };
  const rootParam: [number, number] = [0.58, 0.27];
  const root = surfacePoint(...rootParam);
  const primaryCount = Math.round(MathUtils.lerp(3, 11, smooth(2, 10, day)));
  const paths: VesselPath[] = [];

  const embryoScale = MathUtils.lerp(0.14, 1, smooth(2, 19, day));
  const curl = smooth(1, 19, day);
  const angle = MathUtils.lerp(-0.1, -0.98, curl);
  const localTailX = -0.14 * embryoScale;
  const localTailY = -0.03 * embryoScale;
  const embryoRoot: [number, number, number] = [
    0.06 + curl * 0.07 + localTailX * Math.cos(angle) - localTailY * Math.sin(angle),
    -0.2 - curl * 0.02 + localTailX * Math.sin(angle) + localTailY * Math.cos(angle),
    0.36,
  ];
  paths.push({
    points: [
      root,
      [root[0] * 0.78 + embryoRoot[0] * 0.22, root[1] * 0.72 + embryoRoot[1] * 0.28, root[2] + 0.055],
      embryoRoot,
    ],
    radius: 0.008,
  });

  for (let index = 0; index < primaryCount; index += 1) {
    const theta = (index / primaryCount) * Math.PI * 2;
    const endpointParam: [number, number] = [Math.cos(theta) * 0.83, Math.sin(theta) * 0.83];
    const midpointParam: [number, number] = [
      (rootParam[0] + endpointParam[0]) * 0.5 - Math.sin(theta) * 0.055,
      (rootParam[1] + endpointParam[1]) * 0.5 + Math.cos(theta) * 0.055,
    ];
    const primaryPoints = [root, surfacePoint(...midpointParam), surfacePoint(...endpointParam)];
    const primaryCurve = new CatmullRomCurve3(primaryPoints.map((point) => new Vector3(...point)));
    paths.push({ points: primaryPoints, radius: 0.0058 + (index % 3) * 0.0011 });

    if (day >= 5 && index % 2 === 0) {
      const branchStart = primaryCurve.getPointAt(0.58);
      const branchParam: [number, number] = [
        rootParam[0] * 0.42 + endpointParam[0] * 0.58,
        rootParam[1] * 0.42 + endpointParam[1] * 0.58,
      ];
      const direction = index % 4 === 0 ? 1 : -1;
      const branchMid: [number, number] = [
        branchParam[0] - Math.sin(theta) * direction * 0.07,
        branchParam[1] + Math.cos(theta) * direction * 0.07,
      ];
      const branchEnd: [number, number] = [
        branchParam[0] - Math.sin(theta) * direction * 0.16,
        branchParam[1] + Math.cos(theta) * direction * 0.16,
      ];
      paths.push({
        points: [
          [branchStart.x, branchStart.y, branchStart.z],
          surfacePoint(...branchMid),
          surfacePoint(...branchEnd),
        ],
        radius: 0.0028 + (index % 3) * 0.00045,
      });
    }
  }
  return paths;
}

function VascularNetwork({
  day,
  ovoscopy,
  onSelect,
}: {
  day: number;
  ovoscopy: boolean;
  onSelect: () => void;
}) {
  const paths = useMemo(() => createVesselPaths(day), [day]);
  const geometries = useMemo(
    () => paths.map((path) => curveGeometry(path.points, path.radius, 32, 0.2)),
    [paths],
  );
  useDispose(geometries);
  const opacity = (0.25 + smooth(3, 9, day) * 0.72) * (1 - smooth(17, 21, day) * 0.62);
  return (
    <group
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {geometries.map((geometry, index) => (
        <mesh geometry={geometry} key={index} renderOrder={4}>
          <meshStandardMaterial
            color={ovoscopy ? "#f18460" : index % 2 ? "#a94a48" : "#b6574e"}
            emissive={ovoscopy ? "#812b20" : "#23090c"}
            emissiveIntensity={ovoscopy ? 0.26 : 0.08}
            roughness={0.62}
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function ExtraembryonicMembranes({
  day,
  sectioned,
  ovoscopy,
  onSelect,
}: {
  day: number;
  sectioned: boolean;
  ovoscopy: boolean;
  onSelect: () => void;
}) {
  const amnion = useMemo(() => createEggSurfaceGeometry(sectioned, 0.71, 64), [sectioned]);
  const allantois = useMemo(() => createEggSurfaceGeometry(sectioned, 0.79, 64), [sectioned]);
  const disposable = useMemo(() => [amnion, allantois], [amnion, allantois]);
  useDispose(disposable);
  const amnionOpacity = smooth(3, 8, day) * (1 - smooth(18, 21, day) * 0.6);
  const allantoisOpacity = smooth(6, 13, day) * (1 - smooth(18, 21, day) * 0.4);
  return (
    <group
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <mesh geometry={allantois} visible={allantoisOpacity > 0.01} renderOrder={3}>
        <meshPhysicalMaterial
          color={ovoscopy ? "#8dbbb0" : "#9ac7ba"}
          roughness={0.28}
          clearcoat={0.15}
          transparent
          opacity={0.12 * allantoisOpacity}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={amnion} visible={amnionOpacity > 0.01} renderOrder={3}>
        <meshPhysicalMaterial
          color="#d1e5d8"
          roughness={0.2}
          transparent
          opacity={0.11 * amnionOpacity}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function AirCell({ day, onSelect }: { day: number; onSelect: () => void }) {
  const size = smooth(16, 19, day);
  const geometry = useMemo(
    () => createEllipsoidGeometry([0.2, 0.075, 0.16], [0, -0.91, 0.04]),
    [],
  );
  const disposable = useMemo(() => [geometry], [geometry]);
  useDispose(disposable);
  return (
    <mesh
      geometry={geometry}
      visible={size > 0.01}
      scale={[size, size, size]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <meshPhysicalMaterial
        color="#96aca9"
        roughness={0.22}
        transparent
        opacity={0.31 * size}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function createShadowTexture() {
  const pixels = new Uint8Array(128 * 128 * 4);
  for (let y = 0; y < 128; y += 1) {
    for (let x = 0; x < 128; x += 1) {
      const index = (y * 128 + x) * 4;
      const radius = Math.hypot((x / 127) * 2 - 1, (y / 127) * 2 - 1);
      pixels[index] = pixels[index + 1] = pixels[index + 2] = 255;
      pixels[index + 3] = Math.round(Math.max(0, 1 - radius) ** 2 * 150);
    }
  }
  const texture = new DataTexture(pixels, 128, 128, RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

export default function EggAnatomy({
  day,
  ovoscopy,
  sectioned,
  hatching,
  showInternals,
  layers,
  selectedLayer,
  onSelectLayer,
}: EggAnatomyProps) {
  const safeDay = MathUtils.clamp(day, 1, 21);
  const shadowTexture = useMemo(() => createShadowTexture(), []);
  useEffect(() => () => shadowTexture.dispose(), [shadowTexture]);
  return (
    <>
      <color attach="background" args={[ovoscopy ? "#05090c" : "#0a1720"]} />
      <ambientLight intensity={ovoscopy ? 0.28 : 0.54} />
      <hemisphereLight args={[ovoscopy ? "#dfac7b" : "#d8eeee", "#26323c", 0.46]} />
      <directionalLight position={[-3.5, 4, 4]} intensity={ovoscopy ? 0.24 : 2} color="#fff0da" />
      <directionalLight position={[3, 2, -4]} intensity={ovoscopy ? 1.35 : 1.2} color={ovoscopy ? "#ffb36c" : "#a8e3dc"} />
      <pointLight position={[0.25, 0.15, 2.5]} intensity={ovoscopy ? 1.6 : 0.42} color="#ffd6a0" distance={5} />
      {ovoscopy && <pointLight position={[0, 0, -1.4]} intensity={13} color="#ff9b4a" distance={3.2} />}

      <mesh position={[0.08, -1.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 2.3]} />
        <meshBasicMaterial
          map={shadowTexture}
          color="#26343a"
          transparent
          opacity={0.62}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {showInternals && layers.albumen && (
        <Albumen
          sectioned={sectioned}
          selected={selectedLayer === "albumen"}
          onSelect={() => onSelectLayer("albumen")}
        />
      )}
      {showInternals && layers.extraembryonic && safeDay >= 4 && (
        <ExtraembryonicMembranes
          day={safeDay}
          sectioned={sectioned}
          ovoscopy={ovoscopy}
          onSelect={() => onSelectLayer("extraembryonic")}
        />
      )}
      {showInternals && layers.yolk && (
        <YolkContents
          day={safeDay}
          ovoscopy={ovoscopy}
          selected={selectedLayer === "yolk"}
          onSelect={() => onSelectLayer("yolk")}
        />
      )}
      {showInternals && layers.membranes && (
        <Chalazae onSelect={() => onSelectLayer("membranes")} />
      )}
      {showInternals && layers.vessels && safeDay >= 2 && (
        <VascularNetwork
          day={safeDay}
          ovoscopy={ovoscopy}
          onSelect={() => onSelectLayer("vessels")}
        />
      )}
      {showInternals && layers.extraembryonic && (
        <AirCell day={safeDay} onSelect={() => onSelectLayer("membranes")} />
      )}
      {showInternals && layers.embryo && (
        <OrganicEmbryo
          day={safeDay}
          ovoscopy={ovoscopy}
          selected={selectedLayer === "embryo"}
          onSelect={() => onSelectLayer("embryo")}
        />
      )}
      {layers.membranes && (
        <ShellMembranes
          sectioned={sectioned && !hatching}
          hatching={hatching}
          ovoscopy={ovoscopy}
          onSelect={() => onSelectLayer("membranes")}
        />
      )}
      {layers.shell && (
        <EggShell
          sectioned={sectioned && !hatching}
          hatching={hatching}
          ovoscopy={ovoscopy}
          selected={selectedLayer === "shell"}
          onSelect={() => onSelectLayer("shell")}
        />
      )}
    </>
  );
}
