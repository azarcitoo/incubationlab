"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  InstancedMesh,
  Matrix4,
  MathUtils,
  MeshPhysicalMaterial,
  Quaternion,
  Vector3,
} from "three";

type OrganicEmbryoProps = {
  day: number;
  ovoscopy: boolean;
  selected: boolean;
  onSelect: () => void;
};

type Stage = {
  day: number;
  bodyLength: number;
  trunk: number;
  headRatio: number;
  head: number;
  eye: number;
  eyeOpen: number;
  beak: number;
  wing: number;
  leg: number;
  digits: number;
  down: number;
  curl: number;
  neck: number;
  tuck: number;
};

type ProfilePoint = {
  t: number;
  centerY: number;
  verticalRadius: number;
  depthRadius: number;
};

type PlumageInstance = {
  matrix: Matrix4;
  color: Color;
};

const stages: Stage[] = [
  { day: 1, bodyLength: 0, trunk: 0, headRatio: 0, head: 0, eye: 0, eyeOpen: 0, beak: 0, wing: 0, leg: 0, digits: 0, down: 0, curl: 0, neck: 0, tuck: 0 },
  { day: 2, bodyLength: 0.11, trunk: 0.035, headRatio: 1.25, head: 0.16, eye: 0.015, eyeOpen: 0, beak: 0, wing: 0, leg: 0, digits: 0, down: 0, curl: 0.03, neck: 0.06, tuck: 0 },
  { day: 3, bodyLength: 0.3, trunk: 0.052, headRatio: 1.2, head: 0.3, eye: 0.05, eyeOpen: 0.1, beak: 0, wing: 0, leg: 0, digits: 0, down: 0, curl: 0.08, neck: 0.12, tuck: 0 },
  { day: 4, bodyLength: 0.42, trunk: 0.07, headRatio: 1.12, head: 0.43, eye: 0.13, eyeOpen: 0.5, beak: 0.015, wing: 0.06, leg: 0.015, digits: 0, down: 0, curl: 0.12, neck: 0.2, tuck: 0 },
  { day: 5, bodyLength: 0.5, trunk: 0.09, headRatio: 1.04, head: 0.55, eye: 0.25, eyeOpen: 0.9, beak: 0.06, wing: 0.15, leg: 0.06, digits: 0, down: 0, curl: 0.17, neck: 0.28, tuck: 0 },
  { day: 7, bodyLength: 0.65, trunk: 0.12, headRatio: 0.96, head: 0.7, eye: 0.5, eyeOpen: 1, beak: 0.18, wing: 0.31, leg: 0.16, digits: 0.08, down: 0, curl: 0.24, neck: 0.4, tuck: 0 },
  { day: 10, bodyLength: 0.95, trunk: 0.15, headRatio: 0.86, head: 0.8, eye: 0.74, eyeOpen: 1, beak: 0.42, wing: 0.5, leg: 0.38, digits: 0.32, down: 0.015, curl: 0.34, neck: 0.55, tuck: 0 },
  { day: 12, bodyLength: 1.25, trunk: 0.175, headRatio: 0.78, head: 0.84, eye: 0.85, eyeOpen: 0.45, beak: 0.6, wing: 0.63, leg: 0.54, digits: 0.56, down: 0.08, curl: 0.42, neck: 0.65, tuck: 0 },
  { day: 14, bodyLength: 1.5, trunk: 0.195, headRatio: 0.72, head: 0.87, eye: 0.9, eyeOpen: 0, beak: 0.73, wing: 0.74, leg: 0.67, digits: 0.73, down: 0.2, curl: 0.53, neck: 0.72, tuck: 0.08 },
  { day: 17, bodyLength: 1.9, trunk: 0.225, headRatio: 0.65, head: 0.9, eye: 0.94, eyeOpen: 0, beak: 0.9, wing: 0.88, leg: 0.78, digits: 0.9, down: 0.48, curl: 0.76, neck: 0.84, tuck: 0.62 },
  { day: 19, bodyLength: 2.15, trunk: 0.245, headRatio: 0.61, head: 0.92, eye: 0.92, eyeOpen: 0, beak: 0.98, wing: 0.96, leg: 0.83, digits: 1, down: 0.78, curl: 0.9, neck: 0.92, tuck: 0.9 },
  { day: 21, bodyLength: 2.24, trunk: 0.25, headRatio: 0.59, head: 0.92, eye: 0.9, eyeOpen: 0, beak: 1, wing: 0.98, leg: 0.78, digits: 1, down: 0.94, curl: 0.94, neck: 0.94, tuck: 1 },
];

const clamp01 = (value: number) => MathUtils.clamp(value, 0, 1);
const smooth = (t: number) => {
  const value = clamp01(t);
  return value * value * (3 - 2 * value);
};

function stageAt(day: number): Stage {
  const safeDay = MathUtils.clamp(day, 1, 21);
  for (let index = 1; index < stages.length; index += 1) {
    if (safeDay <= stages[index].day) {
      const previous = stages[index - 1];
      const next = stages[index];
      const blend = smooth((safeDay - previous.day) / (next.day - previous.day));
      return {
        day: safeDay,
        bodyLength: MathUtils.lerp(previous.bodyLength, next.bodyLength, blend),
        trunk: MathUtils.lerp(previous.trunk, next.trunk, blend),
        headRatio: MathUtils.lerp(previous.headRatio, next.headRatio, blend),
        head: MathUtils.lerp(previous.head, next.head, blend),
        eye: MathUtils.lerp(previous.eye, next.eye, blend),
        eyeOpen: MathUtils.lerp(previous.eyeOpen, next.eyeOpen, blend),
        beak: MathUtils.lerp(previous.beak, next.beak, blend),
        wing: MathUtils.lerp(previous.wing, next.wing, blend),
        leg: MathUtils.lerp(previous.leg, next.leg, blend),
        digits: MathUtils.lerp(previous.digits, next.digits, blend),
        down: MathUtils.lerp(previous.down, next.down, blend),
        curl: MathUtils.lerp(previous.curl, next.curl, blend),
        neck: MathUtils.lerp(previous.neck, next.neck, blend),
        tuck: MathUtils.lerp(previous.tuck, next.tuck, blend),
      };
    }
  }
  return stages[stages.length - 1];
}

function interpolateProfile(points: ProfilePoint[], t: number): ProfilePoint {
  let upper = points.findIndex((point) => point.t >= t);
  if (upper < 0) upper = points.length - 1;
  const lower = Math.max(0, upper - 1);
  const start = points[lower];
  const end = points[upper];
  const previous = points[Math.max(0, lower - 1)];
  const next = points[Math.min(points.length - 1, upper + 1)];
  const blend = upper === lower ? 0 : clamp01((t - start.t) / (end.t - start.t));
  const interval = end.t - start.t;
  const interpolate = (key: "centerY" | "verticalRadius" | "depthRadius") => {
    if (upper === lower) return start[key];
    const m0 =
      lower === 0
        ? end[key] - start[key]
        : ((end[key] - previous[key]) / (end.t - previous.t)) * interval;
    const m1 =
      upper === points.length - 1
        ? end[key] - start[key]
        : ((next[key] - start[key]) / (next.t - start.t)) * interval;
    const u2 = blend * blend;
    const u3 = u2 * blend;
    return (
      (2 * u3 - 3 * u2 + 1) * start[key] +
      (u3 - 2 * u2 + blend) * m0 +
      (-2 * u3 + 3 * u2) * end[key] +
      (u3 - u2) * m1
    );
  };
  return {
    t,
    centerY: interpolate("centerY"),
    verticalRadius: Math.max(0.001, interpolate("verticalRadius")),
    depthRadius: Math.max(0.001, interpolate("depthRadius")),
  };
}

function createEmbryoProfile(stage: Stage): ProfilePoint[] {
  const trunk = stage.trunk;
  return [
    { t: 0, centerY: -0.36 * trunk, verticalRadius: 0.018 * trunk, depthRadius: 0.018 * trunk },
    { t: 0.11, centerY: -0.25 * trunk, verticalRadius: 0.32 * trunk, depthRadius: 0.3 * trunk },
    { t: 0.28, centerY: -0.08 * trunk, verticalRadius: 0.64 * trunk, depthRadius: 0.6 * trunk },
    { t: 0.43, centerY: 0.02 * trunk, verticalRadius: 0.88 * trunk, depthRadius: 0.82 * trunk },
    { t: 0.53, centerY: 0.14 * trunk + stage.curl * trunk * 0.08, verticalRadius: 0.84 * trunk, depthRadius: 0.78 * trunk },
    { t: 0.62, centerY: 0.24 * trunk + stage.curl * trunk * 0.16, verticalRadius: 0.75 * trunk, depthRadius: 0.7 * trunk },
    { t: 0.69, centerY: 0.32 * trunk + stage.curl * trunk * 0.22, verticalRadius: 0.74 * trunk, depthRadius: 0.69 * trunk },
    { t: 0.75, centerY: 0.39 * trunk + stage.curl * trunk * 0.26, verticalRadius: trunk * (0.8 + stage.headRatio * 0.12), depthRadius: trunk * (0.77 + stage.headRatio * 0.1) },
    { t: 0.82, centerY: 0.42 * trunk + stage.curl * trunk * 0.28, verticalRadius: trunk * (1 + stage.headRatio * 0.35), depthRadius: trunk * (0.94 + stage.headRatio * 0.3) },
    { t: 0.88, centerY: 0.4 * trunk + stage.curl * trunk * 0.26, verticalRadius: trunk * (0.9 + stage.headRatio * 0.2), depthRadius: trunk * (0.86 + stage.headRatio * 0.17) },
    { t: 0.94, centerY: 0.32 * trunk + stage.curl * trunk * 0.2, verticalRadius: trunk * (0.64 + stage.headRatio * 0.02), depthRadius: trunk * (0.6 + stage.headRatio * 0.02) },
    { t: 1, centerY: 0.18 * trunk, verticalRadius: 0.04 * trunk, depthRadius: 0.04 * trunk },
  ];
}

function centerlinePosition(stage: Stage, t: number, profile: ProfilePoint[]) {
  const section = interpolateProfile(profile, t);
  const bend = Math.sin(Math.PI * t);
  const compression = MathUtils.lerp(1, 0.62, stage.tuck);
  return new Vector3(
    MathUtils.lerp(-0.48, 0.52, t) * stage.bodyLength * compression,
    section.centerY -
      bend * stage.bodyLength * (0.1 * stage.curl + 0.12 * stage.tuck),
    0,
  );
}

function createEmbryoSurface(stage: Stage) {
  if (stage.day < 1.5) return new BufferGeometry();

  const profile = createEmbryoProfile(stage);
  const ringCount = 144;
  const radialCount = 56;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const centerlinePoints = Array.from({ length: ringCount + 1 }, (_, ring) =>
    centerlinePosition(stage, ring / ringCount, profile),
  );
  const centerline = new CatmullRomCurve3(centerlinePoints, false, "centripetal");
  const frames = centerline.computeFrenetFrames(ringCount, false);
  const earlySkin = new Vector3(0.72, 0.39, 0.35);
  const matureSkin = new Vector3(0.68, 0.42, 0.32);
  const skin = earlySkin.clone().lerp(matureSkin, smooth((stage.day - 2) / 15));

  for (let ring = 0; ring <= ringCount; ring += 1) {
    const t = ring / ringCount;
    const section = interpolateProfile(profile, t);
    const center = centerline.getPointAt(t);
    const headWarmth = smooth((t - 0.72) / 0.26) * stage.head * 0.05;
    const bellyWarmth = (1 - smooth((t - 0.25) / 0.42)) * 0.035;
    const vertexColor = skin.clone()
      .lerp(new Vector3(0.76, 0.43, 0.34), headWarmth)
      .lerp(new Vector3(0.78, 0.48, 0.36), bellyWarmth);

    for (let radial = 0; radial <= radialCount; radial += 1) {
      const angle = (radial / radialCount) * Math.PI * 2;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      const surfaceFold = 1 + 0.0025 * Math.sin(t * 19 + angle * 3) * Math.sin(angle * 5);
      const point = center
        .clone()
        .addScaledVector(frames.normals[ring], sin * section.verticalRadius * surfaceFold)
        .addScaledVector(frames.binormals[ring], cos * section.depthRadius * surfaceFold);
      positions.push(point.x, point.y, point.z);
      colors.push(vertexColor.x, vertexColor.y, vertexColor.z);
    }
  }

  for (let ring = 0; ring < ringCount; ring += 1) {
    for (let radial = 0; radial < radialCount; radial += 1) {
      const a = ring * (radialCount + 1) + radial;
      const b = a + radialCount + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createGerminalDiscGeometry() {
  const rings = 12;
  const segments = 48;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const pellucida = new Vector3(0.64, 0.31, 0.22);
  const opaca = new Vector3(0.38, 0.13, 0.09);

  for (let ring = 0; ring <= rings; ring += 1) {
    const radius = ring / rings;
    const tint = smooth((radius - 0.58) / 0.42);
    const color = pellucida.clone().lerp(opaca, tint);
    for (let segment = 0; segment <= segments; segment += 1) {
      const angle = (segment / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const localX = x * 0.115;
      const localY = y * 0.068;
      const ellipsoidRadius = (localX / 0.39) ** 2 + ((0.12 + localY) / 0.44) ** 2;
      const z = -0.1 + 0.3 * Math.sqrt(Math.max(0, 1 - ellipsoidRadius)) + 0.002;
      positions.push(localX, localY, z - 0.19);
      colors.push(color.x, color.y, color.z);
    }
  }

  for (let ring = 0; ring < rings; ring += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = ring * (segments + 1) + segment;
      const b = a + segments + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createSweptGeometry(
  points: [number, number, number][],
  startRadius: number,
  endRadius: number,
  radialSegments = 10,
  depthRatio = 0.78,
  profile: "taper" | "leaf" = "taper",
) {
  const curve = new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z)));
  const tubularSegments = Math.max(20, points.length * 8);
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions: number[] = [];
  const indices: number[] = [];

  for (let ring = 0; ring <= tubularSegments; ring += 1) {
    const t = ring / tubularSegments;
    const center = curve.getPointAt(t);
    const taper = profile === "leaf"
      ? startRadius * Math.pow(Math.sin(Math.PI * t), 0.72) + endRadius * (1 - t)
      : Math.pow(1 - t, 0.72) * startRadius + t * endRadius;
    const radius = Math.max(0.0008, taper * (1 + 0.2 * Math.sin(Math.PI * t)));
    for (let radial = 0; radial <= radialSegments; radial += 1) {
      const angle = (radial / radialSegments) * Math.PI * 2;
      const cos = Math.cos(angle) * radius;
      const sin = Math.sin(angle) * radius * depthRatio;
      const point = center
        .clone()
        .addScaledVector(frames.normals[ring], cos)
        .addScaledVector(frames.binormals[ring], sin);
      positions.push(point.x, point.y, point.z);
    }
  }

  for (let ring = 0; ring < tubularSegments; ring += 1) {
    for (let radial = 0; radial < radialSegments; radial += 1) {
      const a = ring * (radialSegments + 1) + radial;
      const b = a + radialSegments + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createBeakGeometry() {
  const sections = 32;
  const radialSegments = 20;
  const positions: number[] = [];
  const indices: number[] = [];

  for (let section = 0; section <= sections; section += 1) {
    const t = section / sections;
    const x = t * 0.14;
    const flare = Math.sin(Math.PI * t * 0.78);
    const taper = Math.pow(1 - t, 0.78);
    const upperRadius = (0.014 + 0.012 * flare) * taper;
    const depthRadius = (0.018 + 0.014 * flare) * taper;
    const centerY = -0.006 - 0.025 * Math.pow(t, 1.2);
    for (let radial = 0; radial <= radialSegments; radial += 1) {
      const angle = (radial / radialSegments) * Math.PI * 2;
      positions.push(
        x,
        centerY + Math.sin(angle) * upperRadius * (Math.sin(angle) > 0 ? 1.15 : 0.78),
        Math.cos(angle) * depthRadius,
      );
    }
  }
  for (let section = 0; section < sections; section += 1) {
    for (let radial = 0; radial < radialSegments; radial += 1) {
      const a = section * (radialSegments + 1) + radial;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createEyeGeometry(radius: number) {
  const positions: number[] = [];
  const indices: number[] = [];
  const latitudes = 16;
  const longitudes = 24;
  for (let lat = 0; lat <= latitudes; lat += 1) {
    const phi = (lat / latitudes) * Math.PI;
    for (let lon = 0; lon <= longitudes; lon += 1) {
      const theta = (lon / longitudes) * Math.PI * 2;
      const cheek = 1 + 0.04 * Math.sin(phi * 3) * Math.sin(theta * 5);
      positions.push(
        Math.sin(phi) * Math.cos(theta) * radius * cheek,
        Math.cos(phi) * radius * 0.92 * cheek,
        Math.sin(phi) * Math.sin(theta) * radius * 0.48 * cheek,
      );
    }
  }
  for (let lat = 0; lat < latitudes; lat += 1) {
    for (let lon = 0; lon < longitudes; lon += 1) {
      const a = lat * (longitudes + 1) + lon;
      const b = a + longitudes + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createPlumuleGeometry() {
  const lengthSegments = 10;
  const radialSegments = 8;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let ring = 0; ring <= lengthSegments; ring += 1) {
    const t = ring / lengthSegments;
    const width = 0.22 * Math.pow(Math.max(0, Math.sin(Math.PI * t)), 0.78);
    for (let radial = 0; radial <= radialSegments; radial += 1) {
      const angle = (radial / radialSegments) * Math.PI * 2;
      positions.push(
        t,
        0.035 * Math.sin(Math.PI * t) + Math.cos(angle) * width,
        Math.sin(angle) * width * 0.16 +                         0.25 * Math.sin(Math.PI * t),
      );
    }
  }
  for (let ring = 0; ring < lengthSegments; ring += 1) {
    for (let radial = 0; radial < radialSegments; radial += 1) {
      const a = ring * (radialSegments + 1) + radial;
      const b = a + radialSegments + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createPlumageInstances(stage: Stage, profile: ProfilePoint[]): PlumageInstance[] {
  if (stage.day < 8) return [];

  const growth = smooth((stage.day - 8) / 10);
  const count = Math.round(1200 * growth);
  if (count === 0) return [];

  const centerlinePoints = Array.from({ length: 96 }, (_, index) =>
    centerlinePosition(stage, index / 95, profile),
  );
  const centerline = new CatmullRomCurve3(centerlinePoints, false, "centripetal");
  const frames = centerline.computeFrenetFrames(96, false);
  const colors = ["#E6D7B2", "#F3E9CF", "#DCCCA8", "#F7EFD8", "#EADAB8"];
  const instances: PlumageInstance[] = [];
  const basis = new Matrix4();
  const quaternion = new Quaternion();
  const scale = new Vector3();

  for (let index = 0; index < count; index += 1) {
    const t = 0.12 + ((index * 0.7548776662466927) % 1) * 0.64;
    const angle = index * 2.39996322973;
    const ring = Math.min(96, Math.round(t * 96));
    const section = interpolateProfile(profile, t);
    const normalAxis = frames.normals[ring];
    const depthAxis = frames.binormals[ring];
    const surfaceNormal = normalAxis
      .clone()
      .multiplyScalar(Math.sin(angle))
      .addScaledVector(depthAxis, Math.cos(angle))
      .normalize();
    const point = centerline.getPointAt(t)
      .addScaledVector(normalAxis, Math.sin(angle) * section.verticalRadius)
      .addScaledVector(depthAxis, Math.cos(angle) * section.depthRadius)
      .addScaledVector(surfaceNormal, 0.0005);
    const backward = centerline.getTangentAt(t).negate().projectOnPlane(surfaceNormal).normalize();
    const featherAxis = backward.clone().addScaledVector(surfaceNormal, 0.22).normalize();
    const lateral = surfaceNormal.clone().cross(backward).normalize();
    const featherNormal = featherAxis.clone().cross(lateral).normalize();
    basis.makeBasis(featherAxis, lateral, featherNormal);
    quaternion.setFromRotationMatrix(basis);

    const length = (0.018 + growth * 0.045) * (0.82 + ((index * 0.754877666) % 1) * 0.34);
    scale.set(length, length, length);
    instances.push({
      matrix: new Matrix4().compose(point, quaternion, scale),
      color: new Color(colors[(index * 7 + Math.floor(index / 5)) % colors.length]),
    });
  }
  return instances;
}

function isInsideEggCavity(point: Vector3) {
  const normalizedY = point.y / 1.12;
  if (Math.abs(normalizedY) >= 0.96) return false;
  const latitudeCosine = Math.sqrt(1 - normalizedY * normalizedY);
  const width = 1 - 0.16 * normalizedY;
  const innerRadius = Math.max(0.002, latitudeCosine - 0.055);
  const radiusX = innerRadius * width * 0.79;
  const radiusZ = innerRadius * width * 0.72;
  return (point.x / radiusX) ** 2 + (point.z / radiusZ) ** 2 < 0.94;
}

export default function OrganicEmbryo({
  day,
  ovoscopy,
  selected,
  onSelect,
}: OrganicEmbryoProps) {
  const stage = useMemo(() => stageAt(day), [day]);
  const bodyCompression = MathUtils.lerp(1, 0.62, stage.tuck);
  const bodySpan = stage.bodyLength * bodyCompression;
  const bodyProfile = useMemo(() => createEmbryoProfile(stage), [stage]);
  const headCenter = useMemo(
    () => centerlinePosition(stage, 0.82, bodyProfile),
    [bodyProfile, stage],
  );
  const headDepth = useMemo(
    () => interpolateProfile(bodyProfile, 0.82).depthRadius,
    [bodyProfile],
  );
  const bodyGeometry = useMemo(() => createEmbryoSurface(stage), [stage]);
  const beakGeometry = useMemo(() => createBeakGeometry(), []);
  const bodyUnit = bodySpan / 0.56;
  const eyeRadius = (0.007 + stage.eye * 0.02) * Math.min(1, bodyUnit);
  const eyeGeometry = useMemo(() => createEyeGeometry(eyeRadius), [eyeRadius]);
  const eyeHighlightGeometry = useMemo(
    () => createEyeGeometry(Math.max(0.002, eyeRadius * 0.24)),
    [eyeRadius],
  );
  const earlyDiscGeometry = useMemo(() => createGerminalDiscGeometry(), []);
  const plumuleGeometry = useMemo(() => createPlumuleGeometry(), []);
  const plumage = useMemo(() => createPlumageInstances(stage, bodyProfile), [bodyProfile, stage]);
  const plumageMesh = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = plumageMesh.current;
    if (!mesh) return;
    plumage.forEach(({ matrix, color }, index) => {
      mesh.setMatrixAt(index, matrix);
      mesh.setColorAt(index, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [plumage]);

  const wingShapes = useMemo(() => {
    const wingForSide = (side: -1 | 1) => {
      const tucked = side < 0 ? stage.tuck : 0;
      const shoulder = centerlinePosition(stage, 0.44, bodyProfile);
      const shoulderDepth = interpolateProfile(bodyProfile, 0.44).depthRadius;
      const points: [number, number, number][] = [
        [shoulder.x, shoulder.y, side * shoulderDepth * 1.05],
        [shoulder.x - 0.04 * bodySpan, shoulder.y - 0.08 * stage.trunk, side * shoulderDepth * 1.42],
        [shoulder.x - 0.13 * bodySpan, shoulder.y - 0.12 * stage.trunk, side * shoulderDepth * 1.55],
        [shoulder.x - 0.2 * bodySpan, shoulder.y - 0.16 * stage.trunk, side * shoulderDepth * 1.24],
      ].map(([x, y, z], index) => {
        if (index === 0) return [x, y, z];
        const coverT = index / 3;
        const coverX = MathUtils.lerp(shoulder.x, headCenter.x, coverT);
        const coverY = MathUtils.lerp(shoulder.y, headCenter.y, coverT);
        return [
          MathUtils.lerp(x, coverX, tucked),
          MathUtils.lerp(y, coverY, tucked),
          MathUtils.lerp(z, side * headDepth * 0.92, tucked),
        ];
      });
      return createSweptGeometry(
        points,
        stage.trunk * (0.55 + stage.wing * 0.3),
        0.002,
        16,
        0.58,
        "leaf",
      );
    };
    return [wingForSide(1), wingForSide(-1)];
  }, [bodyProfile, bodySpan, headCenter, headDepth, stage]);

  const legs = useMemo(() => {
    const legScale = stage.leg;
    if (legScale < 0.025) return [];
    const toeReach = MathUtils.lerp(1, 0.55, stage.tuck);
    return ([-1, 1] as const).map((side) => {
      const hipAxis = centerlinePosition(stage, 0.39, bodyProfile);
      const hipSection = interpolateProfile(bodyProfile, 0.39);
      const hip: [number, number, number] = [
        hipAxis.x - hipSection.verticalRadius * 0.28,
        hipAxis.y - hipSection.verticalRadius * 0.58,
        side * hipSection.depthRadius * 0.96,
      ];
      const legLift = stage.tuck * stage.trunk * 0.28;
      const knee: [number, number, number] = [
        hip[0] - bodySpan * 0.08,
        hip[1] - stage.trunk * (0.34 - stage.tuck * 0.12) + legLift * 0.35,
        side * hipSection.depthRadius * 1.08,
      ];
      const hock: [number, number, number] = [
        knee[0] + bodySpan * 0.045,
        knee[1] - stage.trunk * (0.3 - stage.tuck * 0.14) + legLift * 0.4,
        side * stage.trunk * 1.04,
      ];
      const foot: [number, number, number] = [
        hock[0] + bodySpan * 0.08,
        hock[1] - stage.trunk * (0.14 - stage.tuck * 0.06) + legLift * 0.25,
        side * stage.trunk * 1.08,
      ];
      const shin = createSweptGeometry(
        [hip, knee, hock, foot],
        stage.trunk * 0.11 * legScale,
        stage.trunk * 0.055 * legScale,
        12,
        0.68,
      );
      const footPad = createSweptGeometry(
        [hock, [foot[0] - 0.02 * bodySpan, foot[1] - 0.025 * stage.trunk, foot[2]], foot],
        stage.trunk * 0.075 * legScale,
        stage.trunk * 0.06 * legScale,
        12,
        0.68,
      );
      if (stage.digits < 0.2) return [shin, footPad];
      const toes = ([-1, 0, 1] as const).map((spread) =>
        createSweptGeometry(
          [
            foot,
            [foot[0] + 0.09 * toeReach * bodySpan, foot[1] - 0.02 * stage.trunk, foot[2] + spread * 0.16 * stage.trunk * stage.digits],
            [foot[0] + (0.18 + stage.digits * 0.08) * toeReach * bodySpan, foot[1] - 0.05 * stage.trunk, foot[2] + spread * 0.3 * stage.trunk * stage.digits],
          ],
          stage.trunk * 0.05 * legScale,
          stage.trunk * 0.008 * legScale,
          10,
          0.72,
        ),
      );
      const rearToe = createSweptGeometry(
        [
          foot,
          [foot[0] - 0.07 * toeReach * bodySpan, foot[1] - 0.025 * stage.trunk, foot[2] - side * 0.1 * stage.trunk],
          [foot[0] - 0.14 * toeReach * bodySpan, foot[1] - 0.05 * stage.trunk, foot[2] - side * 0.16 * stage.trunk],
        ],
        stage.trunk * 0.04 * legScale,
        stage.trunk * 0.008 * legScale,
        9,
        0.72,
      );
      return [shin, footPad, ...toes, rearToe];
    }).flat();
  }, [bodyProfile, bodySpan, stage]);

  const beakScale = stage.beak;
  const beakUnit = Math.min(bodyUnit, stage.trunk * 4.2);
  const embryoRotation = -(stage.curl * 0.12 + stage.tuck * 0.75);
  const embryoPosition = useMemo(
    () => new Vector3(
      0.06 + stage.tuck * 0.015,
      -0.14 - stage.tuck * 0.02,
      0.12,
    ),
    [stage.tuck],
  );
  const fitScale = useMemo(() => {
    const samples: Vector3[] = [];
    const sampleGeometry = (
      geometry: BufferGeometry,
      transform?: (point: Vector3) => Vector3,
      stride = 8,
    ) => {
      const positions = geometry.getAttribute("position");
      if (!positions) return;
      const point = new Vector3();
      for (let index = 0; index < positions.count; index += stride) {
        point.fromBufferAttribute(positions, index);
        samples.push(transform ? transform(point.clone()) : point.clone());
      }
    };

    sampleGeometry(bodyGeometry);
    wingShapes.forEach((geometry) => sampleGeometry(geometry));
    legs.forEach((geometry) => sampleGeometry(geometry));

    const eyeCenter = new Vector3(headCenter.x + 0.008 * bodyUnit, headCenter.y, 0);
    for (const side of [-1, 1]) {
      sampleGeometry(
        eyeGeometry,
        (point) => point.set(point.x, point.y, point.z * 0.85).add(eyeCenter).add(new Vector3(0, 0, side * headDepth + side * eyeRadius * 0.35)),
        6,
      );
      sampleGeometry(
        eyeHighlightGeometry,
        (point) => point.add(new Vector3(
          headCenter.x + 0.011 * bodyUnit,
          headCenter.y + eyeRadius * 0.28,
          side * (headDepth + eyeRadius * 0.35 + eyeRadius * 0.52),
        )),
        8,
      );
    }
    if (beakScale > 0.03) {
      const beakPosition = new Vector3(
        headCenter.x + 0.85 * stage.trunk,
        headCenter.y - 0.05 * stage.trunk,
        0,
      );
      const beakSize = beakScale * beakUnit;
      sampleGeometry(beakGeometry, (point) => point.multiplyScalar(beakSize).add(beakPosition), 4);
    }
    for (const { matrix } of plumage) {
      for (const point of [
        new Vector3(0, 0, 0),
        new Vector3(0.5, 0.22, 0.18),
        new Vector3(0.5, -0.22, 0.18),
        new Vector3(1, 0, 0),
      ]) {
        samples.push(point.applyMatrix4(matrix));
      }
    }

    const rotation = new Vector3(0, 0, 1);
    const fitsAt = (factor: number) => samples.every((sample) => {
      const point = sample.clone()
        .multiplyScalar(factor)
        .applyAxisAngle(rotation, embryoRotation)
        .add(embryoPosition);
      return isInsideEggCavity(point);
    });

    if (fitsAt(1)) return 1;
    let low = 0;
    let high = 1;
    for (let iteration = 0; iteration < 18; iteration += 1) {
      const middle = (low + high) * 0.5;
      if (fitsAt(middle)) low = middle;
      else high = middle;
    }
    return low;
  }, [
    beakGeometry,
    beakScale,
    beakUnit,
    bodyGeometry,
    bodyUnit,
    embryoPosition,
    embryoRotation,
    eyeGeometry,
    eyeHighlightGeometry,
    eyeRadius,
    headCenter,
    headDepth,
    legs,
    plumage,
    stage.trunk,
    wingShapes,
  ]);

  useEffect(
    () => () => {
      wingShapes.forEach((geometry) => geometry.dispose());
      legs.forEach((geometry) => geometry.dispose());
      eyeGeometry.dispose();
      bodyGeometry.dispose();
      eyeHighlightGeometry.dispose();
    },
    [
      bodyGeometry,
      eyeGeometry,
      eyeHighlightGeometry,
      legs,
      wingShapes,
    ],
  );
  useEffect(
    () => () => {
      beakGeometry.dispose();
      earlyDiscGeometry.dispose();
      plumuleGeometry.dispose();
    },
    [beakGeometry, earlyDiscGeometry, plumuleGeometry],
  );

  const bodyMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        vertexColors: true,
        color: selected ? "#fff1d7" : "#ffffff",
        roughness: day < 8 ? 0.64 : 0.84,
        clearcoat: day < 8 ? 0.035 : 0.008,
        clearcoatRoughness: 0.7,
        side: DoubleSide,
      }),
    [day, selected],
  );
  useEffect(
    () => () => bodyMaterial.dispose(),
    [bodyGeometry, bodyMaterial],
  );

  const headX = headCenter.x;
  const headY = headCenter.y;
  const eyeZ = headDepth + eyeRadius * 0.35;
  const discMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.58,
        clearcoat: 0.04,
        side: DoubleSide,
      }),
    [],
  );
  useEffect(() => () => discMaterial.dispose(), [discMaterial]);
  const embryoClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <>
      {day <= 1.5 ? (
        <group
          position={[-0.22, -0.16, 0.19]}
          onClick={embryoClick}
        >
          <mesh geometry={earlyDiscGeometry} material={discMaterial} />
        </group>
      ) : (
        <group
          position={embryoPosition}
          rotation={[0, 0, embryoRotation]}
          scale={fitScale}
          onClick={embryoClick}
        >
          <mesh geometry={bodyGeometry} material={bodyMaterial} />
          {plumage.length > 0 && (
            <instancedMesh
              ref={plumageMesh}
              args={[plumuleGeometry, undefined, plumage.length]}
              onClick={embryoClick}
            >
              <meshPhysicalMaterial
                color="#ffffff"
                roughness={0.98}
                clearcoat={0}
                side={DoubleSide}
              />
            </instancedMesh>
          )}

          {stage.head > 0.05 && (
        <>
          <group position={[headX, headY, 0]}>
            {([-1, 1] as const).map((side) => (
              <group key={`eye-${side}`}>
                <mesh
                  geometry={eyeGeometry}
                  position={[0.008 * bodyUnit, 0, side * eyeZ]}
                  visible={stage.eye > 0.22}
                  scale={[1, 1, 0.85]}
                >
                  <meshPhysicalMaterial
                    color={ovoscopy ? "#512a2b" : "#321d21"}
                    roughness={0.3}
                    clearcoat={0.22}
                    clearcoatRoughness={0.34}
                  />
                </mesh>
                <mesh
                  geometry={eyeHighlightGeometry}
                  position={[0.011 * bodyUnit, eyeRadius * 0.28, side * (eyeZ + eyeRadius * 0.52)]}
                  visible={stage.eyeOpen > 0.08}
                >
                  <meshBasicMaterial color="#fff0d7" />
                </mesh>
                {stage.eye > 0.22 && stage.eyeOpen > 0.08 && stage.eyeOpen < 0.85 && (
                  <mesh
                    geometry={eyeGeometry}
                    position={[0.008 * bodyUnit, 0, side * (eyeZ + eyeRadius * 0.42)]}
                    scale={[1.25, 0.82, 0.48]}
                  >
                    <meshPhysicalMaterial color="#d49b83" roughness={0.82} />
                  </mesh>
                )}
              </group>
            ))}
          </group>
          {beakScale > 0.03 && (
            <group
              position={[headX + 0.85 * stage.trunk, headY - 0.05 * stage.trunk, 0]}
              scale={[beakScale * beakUnit, beakScale * beakUnit, beakScale * beakUnit]}
            >
              <mesh geometry={beakGeometry}>
                <meshPhysicalMaterial
                  color={ovoscopy ? "#dfad58" : "#d89b39"}
                  roughness={0.62}
                  clearcoat={0.035}
                  side={DoubleSide}
                />
              </mesh>
            </group>
          )}
        </>
      )}

          {stage.wing > 0.025 &&
            wingShapes.map((geometry, index) => (
              <mesh geometry={geometry} key={index}>
                <meshPhysicalMaterial
                  color={day < 11 ? "#ad7168" : ovoscopy ? "#d2a07e" : "#b98267"}
                  roughness={0.86}
                  clearcoat={0.005}
                  side={DoubleSide}
                />
              </mesh>
            ))}

          {legs.map((geometry, index) => (
            <mesh geometry={geometry} key={`limb-${index}`}>
              <meshPhysicalMaterial
                color={stage.digits > 0.78 && index > 1 ? "#c1a16c" : "#b77d69"}
                roughness={0.78}
                clearcoat={0.01}
              />
            </mesh>
          ))}

        </group>
      )}
    </>
  );
}
