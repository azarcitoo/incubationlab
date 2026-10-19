import Link from "next/link";
import EducationalPage from "../components/EducationalPage";

const objectives = [
  "Organizar una secuencia didáctica de 21 días que explique cambios generales del desarrollo aviar.",
  "Relacionar el texto científico introductorio con una ilustración 3D interactiva del huevo.",
  "Permitir comparar etapas y explorar conceptos mediante fichas, un cuestionario y escenarios de incubación.",
  "Distinguir las fuentes publicadas de las simplificaciones propias de una simulación educativa.",
];

const technologies = [
  ["Next.js y React", "Estructura de páginas y componentes interactivos."],
  ["TypeScript", "Tipos para los datos de desarrollo, el catálogo y el simulador."],
  ["Three.js, React Three Fiber y Drei", "Escena tridimensional y controles de cámara."],
  ["Lucide React", "Iconografía de la interfaz."],
  ["Node.js", "Pruebas automatizadas del comparador de parámetros."],
];

const references = [
  {
    title: "Hamburger, V. y Hamilton, H. L. (1951). A series of normal stages in the development of the chick embryo.",
    publisher: "Journal of Morphology, 88(1), 49–92.",
    href: "https://doi.org/10.1002/jmor.1050880104",
  },
  {
    title: "UNSW Embryology. Chicken Development.",
    publisher: "University of New South Wales.",
    href: "https://embryology.med.unsw.edu.au/embryology/index.php/Chicken_Development",
  },
  {
    title: "Mississippi State University Extension. Hatching Quality Chicks.",
    publisher: "Mississippi State University Extension.",
    href: "https://extension.msstate.edu/publications/hatching-quality-chicks",
  },
];

export default function AboutPage() {
  return (
    <EducationalPage
      eyebrow="Proyecto educativo STEM"
      title="Acerca de IncubationLab"
      description="Una experiencia interactiva para acercar el desarrollo embrionario aviar al aula mediante visualización, exploración y pensamiento científico."
    >
      <section className="card feature-card about-identity">
        <div>
          <span className="section-kicker">Institución educativa</span>
          <h2>Windsor Royal School</h2>
          <p>Proyecto educativo realizado por estudiantes de grado 10.º.</p>
        </div>
        <div className="about-project-name">
          <span className="section-kicker">Proyecto</span>
          <strong>IncubationLab</strong>
          <span>Desarrollo embrionario aviar · experiencia web educativa</span>
        </div>
      </section>

      <section className="card feature-card about-section">
        <span className="section-kicker">Descripción del proyecto</span>
        <h2>Hacer visible una secuencia biológica compleja</h2>
        <p>
          El desarrollo de un embrión dentro del huevo transcurre en estructuras que no suelen poder observarse directamente sin intervenir en el huevo. IncubationLab aborda este reto educativo mediante fichas diarias, un huevo 3D seccionable, un catálogo de estructuras, comparación entre días y actividades interactivas.
        </p>
        <p>
          La aplicación funciona en el navegador y presenta conceptos de biología y STEM sin controlar una incubadora física.
        </p>
      </section>

      <section className="card feature-card about-section">
        <span className="section-kicker">Propósito de aprendizaje</span>
        <h2>Objetivo general</h2>
        <p>
          Desarrollar una herramienta educativa interactiva que ayude a explorar y contextualizar los cambios generales del desarrollo embrionario de la gallina durante una incubación de referencia de 21 días.
        </p>
        <h3>Objetivos específicos</h3>
        <ul>
          {objectives.map((objective) => <li key={objective}>{objective}</li>)}
        </ul>
        <div className="research-question">
          <span className="section-kicker">Pregunta orientadora</span>
          <p>
            ¿Cómo puede una experiencia digital interactiva ayudar a estudiantes de grado 10.º a explorar las etapas del desarrollo embrionario aviar y relacionarlas con estructuras biológicas?
          </p>
        </div>
      </section>

      <div className="reading-grid">
        <section className="card feature-card">
          <span className="section-kicker">Metodología de desarrollo</span>
          <h2>De las fuentes a la experiencia interactiva</h2>
          <ol>
            <li>Consultar referencias educativas y científicas sobre incubación y desarrollo embrionario aviar.</li>
            <li>Organizar conceptos en fichas diarias prudentes y un catálogo de estructuras con sus funciones.</li>
            <li>Construir una escena 3D procedural y controles interactivos con React Three Fiber.</li>
            <li>Implementar el comparador, el laboratorio referencial y el cuestionario, y comprobarlos con pruebas técnicas.</li>
          </ol>
          <p className="feature-note">
            Esta descripción expone el proceso de software; no presupone una revisión experimental ni una validación externa del contenido.
          </p>
        </section>
        <section className="card feature-card">
          <span className="section-kicker">Fundamentos científicos</span>
          <h2>Incubación y desarrollo aviar</h2>
          <p>
            La incubación proporciona condiciones para que continúe el desarrollo de un huevo fecundado. El embrión utiliza reservas del huevo y se relaciona con membranas extraembrionarias vascularizadas; cerca de la eclosión transita del intercambio gaseoso a través de esas membranas a la respiración pulmonar.
          </p>
          <p>
            La serie de Hamburger y Hamilton organiza el desarrollo embrionario mediante rasgos morfológicos; las fichas del proyecto usan esos fundamentos junto con recursos introductorios de embriología.
          </p>
        </section>
      </div>

      <section className="card feature-card about-section">
        <span className="section-kicker">Tecnologías utilizadas</span>
        <h2>Desarrollo web y visualización 3D</h2>
        <dl className="technology-list">
          {technologies.map(([name, purpose]) => (
            <div className="technology-entry" key={name}>
              <dt>{name}</dt>
              <dd>{purpose}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card feature-card about-section">
        <span className="section-kicker">Alcance y aportes educativos</span>
        <h2>Exploración sin sustituir la observación científica</h2>
        <p>
          El proyecto reúne una línea de tiempo, fichas, una ilustración 3D procedural, un catálogo anatómico, un comparador, un cuestionario y un laboratorio de escenarios basado en valores publicados. Sus aportes son ofrecer varias formas de recorrer los conceptos, practicar vocabulario biológico y contrastar parámetros con una fuente identificable.
        </p>
        <p>
          Para consultar en un solo lugar las limitaciones del modelo, las condiciones de los valores del laboratorio y el alcance de la información, visita la sección de <Link href="/metodologia">metodología y limitaciones</Link>.
        </p>
      </section>

      <section className="card feature-card references-card">
        <span className="section-kicker">Créditos y referencias</span>
        <h2>Fuentes consultadas</h2>
        <p>
          Las definiciones del catálogo y los contenidos de incubación enlazan a las referencias relacionadas con cada tema.
        </p>
        <ol className="reference-list">
          {references.map((reference) => (
            <li key={reference.href}>
              <a href={reference.href} target="_blank" rel="noreferrer">{reference.title}</a>
              <span>{reference.publisher}</span>
            </li>
          ))}
        </ol>
        <p className="feature-note">
          Participantes: estudiantes de grado 10.º de Windsor Royal School. No se atribuyen nombres individuales, avales institucionales ni reconocimientos.
        </p>
      </section>
    </EducationalPage>
  );
}
