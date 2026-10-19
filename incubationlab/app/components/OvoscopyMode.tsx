"use client";

import { Lightbulb, ScanLine } from "lucide-react";

type OvoscopyModeProps = {
  active: boolean;
  onToggle: () => void;
};

export default function OvoscopyMode({ active, onToggle }: OvoscopyModeProps) {
  return (
    <div className="ovoscopy-control">
      <button
        className={`mode-button${active ? " is-active" : ""}`}
        type="button"
        aria-pressed={active}
        onClick={onToggle}
      >
        {active ? <Lightbulb size={15} /> : <ScanLine size={15} />}
        {active ? "Salir de ovoscopia" : "Modo ovoscopia"}
      </button>
      <p className="mode-explanation content-enter" key={String(active)}>
        <strong>{active ? "Simulación activa." : "Observación simulada."}</strong>{" "}
        La ovoscopia real depende del equipo y la experiencia; esta vista no
        determina la viabilidad del embrión.
      </p>
    </div>
  );
}
