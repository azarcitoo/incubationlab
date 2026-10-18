"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Activity, FlaskConical } from "lucide-react";
import DevelopmentPanel from "./DevelopmentPanel";
import IncubationTimeline from "./IncubationTimeline";
import OvoscopyMode from "./OvoscopyMode";
import { getDevelopmentDay } from "../data/development";

const EggViewer = dynamic(() => import("./EggViewer"), {
  ssr: false,
  loading: () => (
    <div className="card viewer-card" aria-label="Cargando visor 3D">
      <div className="viewer-label" style={{ position: "absolute", top: 22, left: 22 }}>
        Preparando el visor 3D…
      </div>
    </div>
  ),
});

export default function IncubationPage() {
  const [day, setDay] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [sectioned, setSectioned] = useState(true);
  const [showInternals, setShowInternals] = useState(true);
  const [ovoscopy, setOvoscopy] = useState(false);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setTimeout(() => {
      if (day >= 21) {
        setPlaying(false);
        return;
      }
      setDay(day + 1);
      if (day === 20) setPlaying(false);
    }, 1700);

    return () => window.clearTimeout(timer);
  }, [day, playing]);

  const changeDay = (nextDay: number) => {
    const safeDay = Math.min(21, Math.max(1, nextDay));
    setDay(safeDay);
    if (safeDay === 21) setPlaying(false);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <FlaskConical size={17} strokeWidth={1.8} />
          </span>
          IncubationLab
        </div>
        <div className="topbar-meta">
          <span className="status-dot" />
          Laboratorio de desarrollo aviar
        </div>
      </header>

      <section className="page-heading" aria-labelledby="page-title">
        <div>
          <span className="eyebrow">Exploración científica · Gallus gallus domesticus</span>
          <h1 id="page-title">La vida dentro del huevo</h1>
          <p>Explora los 21 días del desarrollo embrionario.</p>
        </div>
        <div className="model-notice">
          <Activity size={14} />
          Modelo didáctico, no diagnóstico
        </div>
      </section>

      <div className="workspace">
        <div className="left-column">
          <EggViewer
            day={day}
            ovoscopy={ovoscopy}
            sectioned={sectioned}
            showInternals={showInternals}
            onSectionedChange={() => setSectioned((current) => !current)}
            onShowInternalsChange={() => setShowInternals((current) => !current)}
          />
          <IncubationTimeline
            day={day}
            playing={playing}
            onDayChange={changeDay}
            onTogglePlayback={() => setPlaying((current) => !current)}
          />
        </div>
        <DevelopmentPanel development={getDevelopmentDay(day)} />
      </div>

      <footer className="card bottom-bar">
        <OvoscopyMode
          active={ovoscopy}
          onToggle={() => setOvoscopy((current) => !current)}
        />
        <p className="model-disclaimer">
          Ilustración 3D procedural simplificada. Las etapas son orientativas:
          el ritmo de desarrollo puede variar según las condiciones de
          incubación.
        </p>
      </footer>
    </main>
  );
}
