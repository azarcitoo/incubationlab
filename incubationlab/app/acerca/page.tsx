import EducationalPage from "../components/EducationalPage";

export default function AboutPage() {
  return (
    <EducationalPage
      eyebrow="Proyecto educativo"
      title="Acerca de IncubationLab"
      description="Una experiencia web local para explorar, comparar y contextualizar el desarrollo embrionario del pollo."
    >
      <div className="reading-grid">
        <section className="card feature-card">
          <span className="section-kicker">Propósito</span>
          <h2>Aprender mediante exploración</h2>
          <p>
            IncubationLab reúne una línea de tiempo, un visor 3D conceptual, fichas diarias, comparación de etapas, un explorador textual y actividades formativas. La página no controla una incubadora física ni necesita sensores, cuentas o un servicio de backend para estas funciones.
          </p>
        </section>
        <section className="card feature-card">
          <span className="section-kicker">Autoría y proceso</span>
          <h2>Información pendiente de completar</h2>
          <p>
            Este espacio debe completarse con los datos reales del equipo, la institución, el curso y el proceso de desarrollo antes de presentar el proyecto como trabajo institucional o académico.
          </p>
          <ul>
            <li>Autoría o equipo: pendiente de completar por el proyecto.</li>
            <li>Institución, asignatura y fecha: pendiente de confirmar.</li>
            <li>Revisión de contenido por una persona especialista: no acreditada en esta versión.</li>
          </ul>
        </section>
      </div>
      <section className="card feature-card">
        <span className="section-kicker">Uso responsable</span>
        <h2>Alcance educativo</h2>
        <p>
          El modelo anatómico es una ilustración procedural simplificada, sin validación mediante escaneos ni modelos GLB anatómicos. Los textos temporales son orientativos, el modo de ovoscopia no diagnostica viabilidad y el laboratorio solo compara algunos valores con una fuente citada. No uses la aplicación como asesoramiento para operar equipos ni tomar decisiones de incubación.
        </p>
      </section>
    </EducationalPage>
  );
}
