"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Vector3 } from "three";
import { Egg, Eye, EyeOff, Info, Layers3, RotateCcw, Scissors, ZoomIn, ZoomOut } from "lucide-react";
import { eggLayerInfo, type EggLayerId } from "../data/structures";

export type EggLayers = Record<EggLayerId, boolean>;

const defaultLayers: EggLayers = {
  shell: true,
  membranes: true,
  albumen: true,
  yolk: true,
  vessels: true,
  embryo: true,
  extraembryonic: true,
};

const EggAnatomy = dynamic(() => import("./EggAnatomy"), {
  ssr: false,
});

type EggViewerProps = {
  day: number;
  ovoscopy: boolean;
  sectioned: boolean;
  showInternals: boolean;
  onSectionedChange: () => void;
  onShowInternalsChange: () => void;
};

export default function EggViewer({
  day,
  ovoscopy,
  sectioned,
  showInternals,
  onSectionedChange,
  onShowInternalsChange,
}: EggViewerProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const [layers, setLayers] = useState(defaultLayers);
  const [showLayers, setShowLayers] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<EggLayerId>("embryo");
  const [hatching, setHatching] = useState(false);
  const cameraFrame = useRef<number | null>(null);
  const hatchingActive = hatching && day >= 19;

  const cancelCameraTransition = useCallback(() => {
    if (cameraFrame.current === null) return;
    window.cancelAnimationFrame(cameraFrame.current);
    cameraFrame.current = null;
  }, []);

  useEffect(() => {
    const orbit = controls.current;
    if (!orbit) return;
    orbit.addEventListener("start", cancelCameraTransition);
    return () => {
      orbit.removeEventListener("start", cancelCameraTransition);
      cancelCameraTransition();
    };
  }, [cancelCameraTransition]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopForReducedMotion = () => {
      if (preference.matches) cancelCameraTransition();
    };
    preference.addEventListener("change", stopForReducedMotion);
    return () => preference.removeEventListener("change", stopForReducedMotion);
  }, [cancelCameraTransition]);

  const animateCamera = useCallback((
    destinationPosition: Vector3,
    destinationTarget: Vector3,
    duration: number,
  ) => {
    const orbit = controls.current;
    if (!orbit) return;
    cancelCameraTransition();

    const startPosition = orbit.object.position.clone();
    const startTarget = orbit.target.clone();
    const startTime = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const durationMs = reducedMotion ? 0 : duration;

    const step = (now: number) => {
      const elapsed = durationMs === 0 ? 1 : Math.min(1, (now - startTime) / durationMs);
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      orbit.object.position.lerpVectors(startPosition, destinationPosition, eased);
      orbit.target.lerpVectors(startTarget, destinationTarget, eased);
      orbit.update();

      if (elapsed >= 1) {
        cameraFrame.current = null;
      } else {
        cameraFrame.current = window.requestAnimationFrame(step);
      }
    };

    cameraFrame.current = window.requestAnimationFrame(step);
  }, [cancelCameraTransition]);

  const adjustZoom = (amount: number) => {
    const orbit = controls.current;
    if (!orbit) return;
    const direction = orbit.object.position.clone().sub(orbit.target).normalize();
    const distance = orbit.object.position.distanceTo(orbit.target);
    const nextDistance = Math.max(3.3, Math.min(7.4, distance + amount));
    const destination = orbit.target.clone().addScaledVector(direction, nextDistance);
    animateCamera(destination, orbit.target.clone(), 280);
  };

  const resetView = () => {
    animateCamera(new Vector3(2.65, 1.35, 4.35), new Vector3(0, 0, 0), 350);
  };

  const selectedInfo = eggLayerInfo.find((layer) => layer.id === selectedLayer);

  return (
    <section
      className={`card viewer-card${ovoscopy ? " is-ovoscopy" : ""}`}
      aria-label="Visor 3D del huevo"
    >
      <div className="viewer-topline">
        <div className="viewer-label">
          <span className="status-dot" />
          Modelo conceptual · Día {day}
        </div>
        <div className="view-actions">
          <button
            className={`icon-button${sectioned ? " is-active" : ""}`}
            type="button"
            aria-label={sectioned ? "Desactivar vista seccionada" : "Activar vista seccionada"}
            aria-pressed={sectioned}
            title={sectioned ? "Cerrar sección" : "Vista seccionada"}
            onClick={() => {
              setHatching(false);
              onSectionedChange();
            }}
          >
            <Scissors size={15} />
          </button>
          <button
            className={`icon-button${hatchingActive ? " is-active" : ""}`}
            type="button"
            aria-label={hatchingActive ? "Desactivar modo de eclosión" : "Activar modo de eclosión"}
            aria-pressed={hatchingActive}
            title={day >= 19 ? "Abertura ilustrativa cerca de la cámara de aire" : "Disponible en los últimos días"}
            disabled={day < 19}
            onClick={() => setHatching((current) => !current)}
          >
            <Egg size={15} />
          </button>
          <button
            className={`icon-button${showInternals ? " is-active" : ""}`}
            type="button"
            aria-label={showInternals ? "Ocultar estructuras internas" : "Mostrar estructuras internas"}
            aria-pressed={showInternals}
            title={showInternals ? "Ocultar estructuras internas" : "Mostrar estructuras internas"}
            onClick={onShowInternalsChange}
          >
            {showInternals ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button
            className={`icon-button${showLayers ? " is-active" : ""}`}
            type="button"
            aria-label={showLayers ? "Ocultar controles de capas" : "Mostrar controles de capas"}
            aria-expanded={showLayers}
            title="Capas y estructuras"
            onClick={() => setShowLayers((visible) => !visible)}
          >
            <Layers3 size={15} />
          </button>
          <button className="icon-button" type="button" aria-label="Alejar el modelo" title="Alejar" onClick={() => adjustZoom(0.45)}>
            <ZoomOut size={15} />
          </button>
          <button className="icon-button" type="button" aria-label="Acercar el modelo" title="Acercar" onClick={() => adjustZoom(-0.45)}>
            <ZoomIn size={15} />
          </button>
          <button className="icon-button" type="button" aria-label="Restablecer vista" title="Restablecer vista" onClick={resetView}>
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {showLayers && (
        <div className="egg-layer-panel content-enter" aria-label="Visibilidad de las capas">
          <div className="egg-layer-heading">Capas anatómicas</div>
          {eggLayerInfo.map((layer) => (
            <div className="egg-layer-row" key={layer.id}>
              <button
                className="egg-layer-toggle"
                type="button"
                aria-label={`${layers[layer.id] ? "Ocultar" : "Mostrar"} ${layer.name}`}
                aria-pressed={layers[layer.id]}
                onClick={() => setLayers((current) => ({
                  ...current,
                  [layer.id]: !current[layer.id],
                }))}
              >
                {layers[layer.id] ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button
                className={`egg-layer-name${selectedLayer === layer.id ? " is-selected" : ""}`}
                type="button"
                aria-pressed={selectedLayer === layer.id}
                onClick={() => setSelectedLayer(layer.id)}
              >
                {layer.name}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="viewer-canvas">
        <Canvas
          camera={{ position: [2.65, 1.35, 4.35], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
          frameloop="demand"
        >
          <EggAnatomy
            day={day}
            ovoscopy={ovoscopy}
            sectioned={sectioned}
            hatching={hatchingActive}
            showInternals={showInternals}
            layers={layers}
            selectedLayer={selectedLayer}
            onSelectLayer={setSelectedLayer}
          />
          <OrbitControls
            ref={controls}
            makeDefault
            enablePan={false}
            minDistance={3.3}
            maxDistance={7.4}
            minPolarAngle={0.35}
            maxPolarAngle={Math.PI - 0.35}
            enableDamping
            dampingFactor={0.09}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      {selectedInfo && (
        <div className="egg-structure-note" aria-live="polite">
          <Info size={13} />
          <span><strong>{selectedInfo.name}:</strong> {selectedInfo.description}</span>
        </div>
      )}
      <div className="viewer-bottomline" aria-hidden="true">
        <span>Arrastra para rotar · rueda para acercar</span>
        <span>Visor interactivo · Día {day}</span>
      </div>
    </section>
  );
}
