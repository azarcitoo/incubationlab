"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

const milestones = [1, 7, 14, 18, 21];

type IncubationTimelineProps = {
  day: number;
  playing: boolean;
  onDayChange: (day: number) => void;
  onTogglePlayback: () => void;
};

export default function IncubationTimeline({
  day,
  playing,
  onDayChange,
  onTogglePlayback,
}: IncubationTimelineProps) {
  const progress = ((day - 1) / 20) * 100;

  return (
    <section className="card timeline-card" aria-label="Línea de tiempo de incubación">
      <div className="timeline-heading">
        <div className="timeline-title">
          <h2>Desarrollo embrionario</h2>
          <span>Día {day} de 21</span>
        </div>
        <div className="timeline-buttons">
          <button
            className="timeline-control"
            type="button"
            aria-label="Retroceder un día"
            title="Día anterior"
            disabled={day === 1}
            onClick={() => onDayChange(day - 1)}
          >
            <SkipBack size={14} />
          </button>
          <button
            className="timeline-control play"
            type="button"
            aria-label={playing ? "Pausar recorrido" : "Reproducir recorrido"}
            title={playing ? "Pausar" : "Reproducir"}
            onClick={onTogglePlayback}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            className="timeline-control"
            type="button"
            aria-label="Avanzar un día"
            title="Día siguiente"
            disabled={day === 21}
            onClick={() => onDayChange(day + 1)}
          >
            <SkipForward size={14} />
          </button>
        </div>
      </div>
      <div className="range-wrap">
        <label className="sr-only" htmlFor="incubation-day">
          Seleccionar día de incubación
        </label>
        <input
          id="incubation-day"
          className="day-range"
          type="range"
          min="1"
          max="21"
          step="1"
          value={day}
          style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
          aria-valuetext={`Día ${day} de 21`}
          onChange={(event) => onDayChange(Number(event.currentTarget.value))}
        />
        <div className="milestone-layer" aria-hidden="true">
          {milestones.map((milestoneDay) => (
            <div
              className={`milestone${milestoneDay === day ? " is-current" : ""}`}
              key={milestoneDay}
              style={{ left: `${((milestoneDay - 1) / 20) * 100}%` }}
            >
              <span>{milestoneDay}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="timeline-foot">
        <span>Inicio</span>
        <strong>{Math.round((day / 21) * 100)}% del recorrido</strong>
        <span>Eclosión</span>
      </div>
    </section>
  );
}
