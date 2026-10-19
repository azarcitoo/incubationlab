"use client";

import { CircleDot, Layers3, Sparkles } from "lucide-react";
import type { DevelopmentDay } from "../data/development";

type DevelopmentPanelProps = {
  development: DevelopmentDay;
};

export default function DevelopmentPanel({
  development,
}: DevelopmentPanelProps) {
  const guideProgress = Math.round((development.day / 21) * 100);

  return (
    <aside className="card development-card" aria-live="polite">
      <div className="development-content content-enter" key={development.day}>
        <span className="section-kicker">Ficha de desarrollo</span>
        <div className="development-day">
          <strong>Día {development.day}</strong>
          <span>Incubación</span>
        </div>
        <h2>{development.stage}</h2>
        <p className="development-description">{development.description}</p>
        <div className="development-divider" />
        <section className="info-section">
          <h3>
            <CircleDot size={14} />
            Cambios principales
          </h3>
          <ul className="info-list">
            {development.changes.map((change) => (
              <li key={change}>
                <span className="list-bullet" />
                {change}
              </li>
            ))}
          </ul>
        </section>
        <section className="info-section">
          <h3>
            <Layers3 size={14} />
            Estructuras de interés
          </h3>
          <ul className="info-list">
            {development.structures.map((structure) => (
              <li key={structure}>
                <span className="list-bullet" />
                {structure}
              </li>
            ))}
          </ul>
        </section>
        <div className="curiosity-box">
          <h3>
            <Sparkles size={13} />
            ¿Sabías que…?
          </h3>
          <p>{development.curiosity}</p>
        </div>
        <div className="progress-block">
          <div className="progress-heading">
            <span>Recorrido educativo</span>
            <strong>{guideProgress}%</strong>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Progreso del recorrido educativo"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={guideProgress}
          >
            <div
              className="progress-fill"
              style={{ width: `${guideProgress}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
