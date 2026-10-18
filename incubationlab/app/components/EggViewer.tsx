"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Egg, Eye, EyeOff, Info, Layers3, RotateCcw, Scissors, ZoomIn, ZoomOut } from "lucide-react";

export type EggLayerId =
  | "shell"
  | "membranes"
  | "albumen"
  | "yolk"
  | "vessels"
  | "embryo"
  | "extraembryonic";

export type EggLayers = Record<EggLayerId, boolean>;

const layerInfo: {
  id: EggLayerId;
  name: string;
  description: string;
}[] = [
  { id: "shell", name: "Cáscara", description: "Capa calcificada protectora; en el corte se conserva como una media cáscara." },
  { id: "membranes", name: "Membranas", description: "Las membranas testáceas revisten la cáscara; la vitelina envuelve la yema." },
  { id: "albumen", name: "Clara", description: "Albúmina gelatinosa que amortigua y aporta agua al embrión." },
  { id: "yolk", name: "Yema y saco vitelino", description: "Reserva nutritiva rodeada por el saco vitelino vascularizado." },
  { id: "vessels", name: "Vasos sanguíneos", description: "Red extraembrionaria ilustrativa conectada al embrión y a la superficie del vitelo." },
  { id: "embryo", name: "Embrión", description: "Modelo procedural educativo; silueta y estructuras cambian progresivamente con el día." },
  { id: "extraembryonic", name: "Membranas extraembrionarias", description: "Amnios y corioalantoides simplificados; participan en protección e intercambio." },
];

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
  const hatchingActive = hatching && day >= 19;

  const adjustZoom = (amount: number) => {
    if (!controls.current) return;
    const distance = controls.current.object.position.distanceTo(controls.current.target);
    controls.current.object.position.setLength(Math.max(3.3, Math.min(7.4, distance + amount)));
    controls.current.update();
  };

  const resetView = () => controls.current?.reset();
  const selectedInfo = layerInfo.find((layer) => layer.id === selectedLayer) ?? layerInfo[5];

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
            title={day >= 19 ? "Abertura ilustrativa cerca de la cámara de aire" : "Disponible en los días finales"}
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
        <div className="egg-layer-panel" aria-label="Visibilidad de las capas">
          <div className="egg-layer-heading">Capas anatómicas</div>
          {layerInfo.map((layer) => (
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

      <div className="egg-structure-note" aria-live="polite">
        <Info size={13} />
        <span><strong>{selectedInfo.name}:</strong> {selectedInfo.description}</span>
      </div>
      <div className="viewer-bottomline" aria-hidden="true">
        <span>Arrastra para rotar · rueda para acercar</span>
        <span>Ilustración conceptual, no anatomía validada</span>
      </div>
    </section>
  );
}
