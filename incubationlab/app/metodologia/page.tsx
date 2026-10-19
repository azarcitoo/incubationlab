import EducationalPage from "../components/EducationalPage";

const references = [
  {
    title: "Hamburger, V. y Hamilton, H. L. (1951). A series of normal stages in the development of the chick embryo.",
    publisher: "Journal of Morphology, 88(1), 49–92.",
    href: "https://doi.org/10.1002/jmor.1050880104",
    note: "Referencia clásica para describir estadios morfológicos del embrión de pollo. Los estadios no equivalen rígidamente a días de incubación.",
  },
  {
    title: "UNSW Embryology. Chicken Development.",
    publisher: "University of New South Wales.",
    href: "https://embryology.med.unsw.edu.au/embryology/index.php/Chicken_Development",
    note: "Recurso docente con material sobre el desarrollo del pollo. Consultar las referencias originales para trabajos especializados.",
  },
  {
    title: "Mississippi State University Extension. Hatching Quality Chicks.",
    publisher: "Mississippi State University Extension.",
    href: "https://extension.msstate.edu/publications/hatching-quality-chicks",
    note: "Guía de manejo de incubación que incluye valores de temperatura, humedad, volteo y ventilación en el contexto descrito por la publicación.",
  },
];

export default function MethodologyPage() {
  return (
    <EducationalPage
      eyebrow="Fuentes y alcance"
      title="Metodología y limitaciones"
      description="Cómo se organiza la información, qué respalda cada fuente y qué no puede concluirse a partir de esta experiencia."
    >
      <div className="reading-grid">
        <section className="card feature-card">
          <span className="section-kicker">Contenido embrionario</span>
          <h2>Estadios y días no son lo mismo</h2>
          <p>
            La ficha presenta una secuencia educativa de 21 días. La estadificación de Hamburger y Hamilton se basa en rasgos morfológicos; la correspondencia con el tiempo puede variar según las condiciones y no debe interpretarse como una equivalencia exacta.
          </p>
          <p>
            Los textos diarios sintetizan cambios generales y no constituyen un atlas anatómico ni sustituyen una fuente de embriología especializada. La forma procedural del huevo y del embrión es conceptual, no un escaneo ni una reconstrucción validada.
          </p>
        </section>
        <section className="card feature-card">
          <span className="section-kicker">Simulador de parámetros</span>
          <h2>Escenarios de referencia, no predicciones</h2>
          <p>
            El laboratorio compara temperatura, lectura de bulbo húmedo, volteo y ventilación seleccionados con valores citados por una guía universitaria. No calcula humedad relativa a partir de cada lectura, no evalúa el equipo, no mide condiciones reales y no estima fertilidad, viabilidad ni porcentaje de eclosión.
          </p>
          <p>
            Los valores de aire forzado y aire quieto reflejan la configuración indicada por la publicación. La operación de equipos reales depende de la distribución térmica, la colocación del termómetro, el diseño del fabricante y otros factores que la simulación no modela.
          </p>
        </section>
      </div>
      <section className="card feature-card references-card">
        <span className="section-kicker">Bibliografía consultada</span>
        <h2>Fuentes</h2>
        <ol className="reference-list">
          {references.map((reference) => (
            <li key={reference.href}>
              <a href={reference.href} target="_blank" rel="noreferrer">{reference.title}</a>
              <span>{reference.publisher}</span>
              <p>{reference.note}</p>
            </li>
          ))}
        </ol>
        <p className="feature-note">
          Las fuentes sustentan marcos de referencia generales; no validan automáticamente cada frase diaria ni la geometría del modelo. Para docencia formal o uso técnico, comprueba las publicaciones originales y añade una revisión experta.
        </p>
      </section>
    </EducationalPage>
  );
}
