"use client";

import { useState } from "react";
import EducationalPage from "../components/EducationalPage";
import {
  assessLaboratorySettings,
  getLaboratoryReference,
  type IncubatorType,
} from "../data/laboratory";

const comparisonText = {
  below: "Por debajo del intervalo de referencia citado",
  within: "Dentro del intervalo de referencia citado",
  above: "Por encima del intervalo de referencia citado",
};

const formatCelsius = (fahrenheit: number) =>
  ((fahrenheit - 32) * 5 / 9).toFixed(1).replace(".", ",");

export default function LaboratoryPage() {
  const [day, setDay] = useState(1);
  const [incubatorType, setIncubatorType] = useState<IncubatorType>("forced-air");
  const [temperatureF, setTemperatureF] = useState(100);
  const [wetBulbF, setWetBulbF] = useState(86);
  const [turningEnabled, setTurningEnabled] = useState(true);
  const [ventilationProgressive, setVentilationProgressive] = useState(true);
  const assessment = assessLaboratorySettings({
    day,
    incubatorType,
    temperatureF,
    wetBulbF,
    turningEnabled,
    ventilationProgressive,
  });
  const reference = getLaboratoryReference(day);

  return (
    <EducationalPage
      eyebrow="Simulación de parámetros · sin predicción"
      title="Laboratorio de incubación"
      description="Ajusta un escenario y compáralo con valores guía publicados. La simulación no controla equipos ni predice la eclosión."
    >
      <div className="laboratory-grid">
        <section className="card feature-card lab-controls" aria-label="Controles de simulación">
          <label>
            Día del escenario
            <span className="control-value">Día {day}</span>
            <input type="range" min="1" max="21" value={day} onChange={(event) => setDay(Number(event.target.value))} aria-label="Día del escenario" />
          </label>
          <label>
            Tipo de incubadora de referencia
            <select value={incubatorType} onChange={(event) => {
              const nextType = event.target.value as IncubatorType;
              setIncubatorType(nextType);
              setTemperatureF(nextType === "forced-air" ? 100 : 102);
            }}>
              <option value="forced-air">Aire forzado</option>
              <option value="still-air">Aire quieto</option>
            </select>
          </label>
          <label>
            Temperatura configurada
            <span className="control-value">{temperatureF} °F ({formatCelsius(temperatureF)} °C)</span>
            <input type="range" min="96" max="105" step="0.5" value={temperatureF} onChange={(event) => setTemperatureF(Number(event.target.value))} aria-label="Temperatura configurada en grados Fahrenheit" />
          </label>
          <label>
            Lectura de bulbo húmedo
            <span className="control-value">{wetBulbF} °F</span>
            <input type="range" min="80" max="95" value={wetBulbF} onChange={(event) => setWetBulbF(Number(event.target.value))} aria-label="Lectura de bulbo húmedo en grados Fahrenheit" />
          </label>
          <label className="check-control">
            <input type="checkbox" checked={turningEnabled} onChange={(event) => setTurningEnabled(event.target.checked)} />
            Volteo activado
          </label>
          <label className="check-control">
            <input type="checkbox" checked={ventilationProgressive} onChange={(event) => setVentilationProgressive(event.target.checked)} />
            Ventilación abierta de forma progresiva
          </label>
        </section>

        <section className="card feature-card lab-results" aria-live="polite">
          <span className="section-kicker">Comparación, no diagnóstico</span>
          <h2>Escenario · día {day}</h2>
          <dl className="result-list">
            <div>
              <dt>Temperatura</dt>
              <dd>{comparisonText[assessment.temperature]}</dd>
              <small>Referencia seleccionada: {assessment.referenceTemperatureF} °F ({formatCelsius(assessment.referenceTemperatureF)} °C). La fuente indica que fluctuaciones de 1 °F o menos son tolerables; esto no define por sí solo límites universales de seguridad.</small>
            </div>
            <div>
              <dt>Humedad · bulbo húmedo</dt>
              <dd>{comparisonText[assessment.humidity]}</dd>
              <small>Referencia publicada para este periodo: {reference.wetBulbF}; la fuente también cita {reference.humidityRelativePercent} de humedad relativa. La aplicación no calcula la humedad relativa real a partir de los controles.</small>
            </div>
            <div>
              <dt>Volteo</dt>
              <dd>{assessment.turningMatchesReference ? "Coincide con la pauta de referencia del periodo" : "No coincide con la pauta de referencia del periodo"}</dd>
              <small>{day <= 18 ? "La fuente cita volteo 2–3 veces al día hasta el día 18." : "La fuente recomienda detener el volteo durante los últimos tres días."}</small>
            </div>
            <div>
              <dt>Ventilación</dt>
              <dd>{ventilationProgressive ? "Configurada como progresiva" : "Configurada como limitada"}</dd>
              <small>La fuente describe una apertura gradual; no establece un porcentaje universal para cada día.</small>
            </div>
          </dl>
          <p className="feature-note">
            Estos intervalos no son alarmas, recomendaciones individualizadas ni límites de seguridad para todos los equipos. La lectura del bulbo húmedo y su relación con la humedad relativa dependen de la temperatura y del método de medición. Consulta el manual de tu incubadora y fuentes técnicas.
          </p>
        </section>
      </div>
      <p className="feature-footnote">
        Referencia: Mississippi State University Extension, «Hatching Quality Chicks». Los valores citados distinguen incubadoras de aire forzado y de aire quieto; en el periodo final también pueden aplicarse ajustes específicos de nacedora.
      </p>
    </EducationalPage>
  );
}
