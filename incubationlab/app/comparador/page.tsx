"use client";

import { useState } from "react";
import EducationalPage from "../components/EducationalPage";
import { developmentDays } from "../data/development";

export default function ComparadorPage() {
  const [firstDay, setFirstDay] = useState(1);
  const [secondDay, setSecondDay] = useState(21);
  const first = developmentDays[firstDay - 1];
  const second = developmentDays[secondDay - 1];

  return (
    <EducationalPage
      eyebrow="Desarrollo · comparación por etapas"
      title="Comparador de etapas"
      description="Contrasta dos fichas diarias sin presentar el modelo conceptual como una reconstrucción anatómica precisa."
    >
      <section className="card feature-card" aria-label="Seleccionar días para comparar">
        <div className="compare-selectors">
          <label>
            Primera etapa
            <select value={firstDay} onChange={(event) => setFirstDay(Number(event.target.value))}>
              {developmentDays.map(({ day }) => (
                <option key={day} value={day}>Día {day}</option>
              ))}
            </select>
          </label>
          <span className="compare-divider" aria-hidden="true">↔</span>
          <label>
            Segunda etapa
            <select value={secondDay} onChange={(event) => setSecondDay(Number(event.target.value))}>
              {developmentDays.map(({ day }) => (
                <option key={day} value={day}>Día {day}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="feature-note">
          Se comparan las descripciones educativas y las estructuras destacadas. La aplicación no genera dos modelos anatómicos independientes.
        </p>
      </section>

      <div className="comparison-grid">
        {[first, second].map((item, index) => (
          <article className="card feature-card compare-card" key={`${index}-${item.day}`}>
            <span className="section-kicker">{index === 0 ? "Primera etapa" : "Segunda etapa"}</span>
            <h2>Día {item.day}: {item.stage}</h2>
            <p>{item.description}</p>
            <h3>Cambios principales</h3>
            <ul>{item.changes.map((change) => <li key={change}>{change}</li>)}</ul>
            <h3>Estructuras destacadas</h3>
            <div className="tag-list">
              {item.structures.map((structure) => <span className="science-tag" key={structure}>{structure}</span>)}
            </div>
            <aside className="curiosity-box">
              <h3>Para recordar</h3>
              <p>{item.curiosity}</p>
            </aside>
          </article>
        ))}
      </div>
      <p className="feature-footnote">
        Las descripciones y los intervalos diarios son orientativos. La estadificación científica se basa en rasgos morfológicos y no siempre coincide exactamente con el día de incubación.
      </p>
    </EducationalPage>
  );
}
