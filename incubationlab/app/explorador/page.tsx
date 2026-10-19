"use client";

import { useState } from "react";
import EducationalPage from "../components/EducationalPage";
import { developmentDays } from "../data/development";

const structureNotes: Record<string, string> = {
  "Disco germinal": "Región celular del huevo fertilizado donde se organiza el desarrollo embrionario temprano.",
  Blastodermo: "Conjunto de células que se organiza sobre el vitelo y da origen al embrión y sus tejidos asociados.",
  "Tubo neural": "Estructura embrionaria temprana que contribuye a formar el encéfalo y la médula espinal.",
  "Corazón temprano": "El sistema cardiovascular se organiza pronto y participa en la circulación embrionaria.",
  "Vasos vitelinos iniciales": "Vasos extraembrionarios que conectan el embrión con el vitelo y apoyan el transporte de nutrientes.",
  Amnios: "Membrana que rodea al embrión y forma un entorno protector.",
  "Red vascular": "Vasos extraembrionarios vinculados al intercambio y al transporte durante el desarrollo.",
  "Saco vitelino": "Estructura extraembrionaria asociada al vitelo, una reserva nutritiva del embrión.",
  "Alantoides en expansión": "Membrana extraembrionaria que participa en el intercambio gaseoso y en el manejo de desechos.",
  "Membrana corioalantoidea": "Membrana extraembrionaria vascularizada que contribuye al intercambio de gases a través de la cáscara.",
  Pulmones: "Al acercarse la eclosión, el embrión transita hacia la respiración pulmonar.",
  "Cámara de aire": "Espacio situado en el extremo ancho del huevo que participa en la transición respiratoria previa a la eclosión.",
  "Membrana interna": "Membrana bajo la cáscara; el picaje hacia la cámara de aire puede preceder al picaje exterior.",
  Pico: "Estructura del rostro que, al final del desarrollo, interviene en el picaje de las membranas y la cáscara.",
  Plumón: "Plumas suaves que pueden cubrir al polluelo al eclosionar; su aspecto y desarrollo varían.",
  "Folículos de plumas": "Estructuras de la piel a partir de las cuales se desarrollan las plumas.",
};

const stageForDay = (day: number) => {
  if (day <= 3) return "Días 1–3 · Desarrollo temprano";
  if (day <= 7) return "Días 4–7 · Organización corporal inicial";
  if (day <= 10) return "Días 8–10 · Diferenciación";
  if (day <= 14) return "Días 11–14 · Crecimiento y plumaje";
  if (day <= 18) return "Días 15–18 · Maduración";
  return "Días 19–21 · Eclosión";
};

export default function ExploradorPage() {
  const [day, setDay] = useState(1);
  const development = developmentDays[day - 1];
  const [selected, setSelected] = useState(development.structures[0]);
  const selectedStructure = development.structures.includes(selected)
    ? selected
    : development.structures[0];

  return (
    <EducationalPage
      eyebrow="Estructuras · guía educativa"
      title="Explorador anatómico"
      description="Recorre las estructuras mencionadas en la ficha diaria y consulta una explicación breve de su función o contexto."
    >
      <section className="card feature-card explorer-controls">
        <label className="day-select-label" htmlFor="explorer-day">Día de incubación</label>
        <div className="explorer-day-row">
          <input
            id="explorer-day"
            className="day-range"
            type="range"
            min="1"
            max="21"
            value={day}
            onChange={(event) => setDay(Number(event.target.value))}
            aria-valuetext={`Día ${day}`}
          />
          <output htmlFor="explorer-day">Día {day}</output>
        </div>
        <p className="section-kicker">{stageForDay(day)}</p>
        <p>{development.description}</p>
      </section>

      <div className="explorer-grid">
        <section className="card feature-card" aria-labelledby="structures-title">
          <span className="section-kicker">Ficha diaria</span>
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
          <span className="section-kicker">Día {day}</span>
          <h2>{selectedStructure}</h2>
          <p>{structureNotes[selectedStructure] ?? "Esta estructura se menciona en la ficha educativa de este día. Su forma y su cronología exacta no se reconstruyen anatómicamente en este visor."}</p>
          <p className="feature-note">
            Esta selección cambia la ficha textual; no selecciona ni resalta una malla 3D específica. Las geometrías del huevo y del embrión son ilustraciones procedurales simplificadas.
          </p>
        </article>
      </div>
      <p className="feature-footnote">
        La cronología diaria es aproximada. Los estadios embrionarios de Hamburger y Hamilton describen rasgos morfológicos y no deben tratarse como una equivalencia exacta entre estadio y día.
      </p>
    </EducationalPage>
  );
}
