"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import EducationalPage from "../components/EducationalPage";
import { developmentDays } from "../data/development";
import {
  eggLayerInfo,
  getStructureDefinition,
  getStructureSource,
} from "../data/structures";

const stageForDay = (day: number) => {
  if (day <= 3) return "Días 1–3 · Desarrollo temprano";
  if (day <= 7) return "Días 4–7 · Organización corporal inicial";
  if (day <= 10) return "Días 8–10 · Diferenciación";
  if (day <= 14) return "Días 11–14 · Crecimiento y plumaje";
  if (day <= 18) return "Días 15–18 · Maduración";
  return "Días 19–21 · Eclosión";
};

const formatDays = (days: number[]) => {
  if (days.length === 1) return `Día ${days[0]}`;
  return `Días ${days.join(", ")}`;
};

export default function ExploradorPage() {
  const [day, setDay] = useState(1);
  const development = developmentDays[day - 1];
  const [selected, setSelected] = useState(development.structures[0]);
  const selectedStructure = development.structures.includes(selected)
    ? selected
    : development.structures[0];
  const definition = getStructureDefinition(selectedStructure);
  const source = getStructureSource(definition.source);
  const highlightedDays = developmentDays
    .filter(({ structures }) => structures.includes(selectedStructure))
    .map(({ day: highlightedDay }) => highlightedDay);
  const layer = definition.viewerLayer
    ? eggLayerInfo.find(({ id }) => id === definition.viewerLayer)
    : undefined;

  const changeDay = (nextDay: number) => {
    setDay(nextDay);
    setSelected(developmentDays[nextDay - 1].structures[0]);
  };

  return (
    <EducationalPage
      eyebrow="Estructuras · guía educativa"
      title="Explorador anatómico"
      description="Selecciona un día y consulta definiciones, funciones y contexto de desarrollo para cada estructura destacada. Algunas se relacionan con capas esquemáticas del visor."
    >
      <section className="card feature-card explorer-controls" aria-label="Día del desarrollo">
        <label className="day-select-label" htmlFor="explorer-day">Día de incubación</label>
        <div className="explorer-day-row">
          <input
            id="explorer-day"
            className="day-range"
            type="range"
            min={1}
            max={21}
            step={1}
            value={day}
            style={{ "--range-progress": `${((day - 1) / 20) * 100}%` } as CSSProperties}
            onChange={(event) => changeDay(Number(event.target.value))}
            aria-valuetext={`Día ${day}`}
          />
          <output htmlFor="explorer-day">Día {day}</output>
        </div>
        <p className="section-kicker">{stageForDay(day)}</p>
        <p>{development.description}</p>
      </section>

      <div className="explorer-grid">
        <section className="card feature-card" aria-labelledby="structures-title">
          <span className="section-kicker">Día {day} · ficha diaria</span>
          <h2 id="structures-title">Estructuras destacadas</h2>
          <div className="structure-picker" role="group" aria-label="Seleccionar estructura">
            {development.structures.map((structure) => (
              <button
                key={structure}
                className={`structure-choice${structure === selectedStructure ? " is-selected" : ""}`}
                type="button"
                aria-pressed={structure === selectedStructure}
                onClick={() => setSelected(structure)}
              >
                {structure}
              </button>
            ))}
          </div>
        </section>
        <article className="card feature-card structure-detail" aria-live="polite">
          <div className="content-enter" key={`${day}-${selectedStructure}`}>
            <span className="section-kicker">Definición · día {day}</span>
            <h2>{selectedStructure}</h2>
            <div className="definition-block">
              <h3>Qué es</h3>
              <p>{definition.definition}</p>
            </div>
            <div className="definition-block">
              <h3>Función y relación con el desarrollo</h3>
              <p>{definition.role}</p>
            </div>
            <div className="definition-context">
              <strong>Etapa:</strong> {definition.development}
              {highlightedDays.length > 0 && (
                <span className="definition-days">
                  En esta secuencia se destaca en {formatDays(highlightedDays)}.
                </span>
              )}
            </div>
            <a className="definition-source" href={source.href} target="_blank" rel="noreferrer">
              Fuente: {source.label}
            </a>
            {layer && (
              <p className="representation-note">
                Capa relacionada en el visor: {layer.name} (representación esquemática).
              </p>
            )}
          </div>
        </article>
      </div>
    </EducationalPage>
  );
}
