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
            Los textos diarios sintetizan cambios generales y las definiciones enlazan referencias introductorias. El catálogo es una guía de aprendizaje, no una estadificación diagnóstica.
          </p>
        </section>
        <section className="card feature-card">
          <span className="section-kicker">Simulador de parámetros</span>
          <h2>Referencias convertidas al sistema Celsius</h2>
          <p>
            Las temperaturas de incubación y las lecturas de bulbo húmedo de la guía de Mississippi State University Extension se convirtieron a grados Celsius y se redondearon a una décima. Para aire forzado se muestran 37,8 °C y para aire quieto, 38,9 °C. El bulbo húmedo se presenta como 29,4–30,6 °C durante los primeros 18 días y 31,7–32,2 °C en los tres días finales. La humedad relativa citada por la guía se conserva como porcentaje.
          </p>
          <p>
            El control compara con esos valores de referencia y con la tolerancia publicada, pero no mide un equipo ni calcula la humedad relativa a partir del bulbo húmedo. No estima fertilidad, viabilidad ni porcentaje de eclosión. Para operar una incubadora se deben seguir las indicaciones de su fabricante.
          </p>
        </section>
      </div>
      <section className="card feature-card references-card">
        <span className="section-kicker">Alcance de la visualización</span>
        <h2>Modelo 3D conceptual</h2>
        <p>
          El huevo y el embrión se construyen con geometría procedural para ilustrar relaciones espaciales y cambios generales. No representan tejidos escaneados ni una reconstrucción anatómica validada, y el porcentaje de la línea de tiempo indica el avance por días del recorrido, no una medición fisiológica.
        </p>
        <p>
          El modo de ovoscopia cambia la iluminación de la escena y simula una fuente de luz situada detrás del huevo.
        </p>
      </section>
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
      </section>
    </EducationalPage>
  );
}
