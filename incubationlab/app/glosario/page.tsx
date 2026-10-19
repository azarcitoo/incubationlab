import EducationalPage from "../components/EducationalPage";

const glossary = [
  ["Alantoides", "Membrana extraembrionaria que participa en el intercambio gaseoso y en el almacenamiento de desechos durante el desarrollo."],
  ["Amnios", "Membrana que rodea al embrión y delimita un entorno protector."],
  ["Blastodermo", "Conjunto de células que se desarrolla sobre el vitelo y del que se organiza el embrión."],
  ["Cámara de aire", "Espacio situado en el extremo ancho del huevo, entre las membranas de la cáscara."],
  ["Corioalantoides", "Membrana extraembrionaria formada por la asociación del corion y el alantoides, relacionada con el intercambio gaseoso."],
  ["Eclosión", "Proceso por el que el polluelo rompe las membranas y la cáscara y sale del huevo."],
  ["Estadio HH", "Categoría morfológica de la serie de Hamburger y Hamilton; no es una asignación exacta a un día de incubación."],
  ["Folículo plumoso", "Estructura de la piel en la que se desarrolla una pluma."],
  ["Ovoscopia", "Observación de un huevo iluminado desde atrás. Su interpretación requiere contexto y no queda reproducida como diagnóstico por esta web."],
  ["Picaje interno", "Ruptura de la membrana interna por el polluelo, normalmente hacia la cámara de aire, antes del picaje exterior."],
  ["Saco vitelino", "Estructura extraembrionaria vinculada al vitelo y al suministro de nutrientes para el embrión."],
  ["Vitelo", "Reserva nutritiva del huevo utilizada por el embrión en desarrollo."],
];

export default function GlossaryPage() {
  return (
    <EducationalPage
      eyebrow="Términos clave"
      title="Glosario"
      description="Definiciones breves para interpretar las fichas y las estructuras representadas en el laboratorio."
    >
      <dl className="card feature-card glossary-list">
        {glossary.map(([term, definition]) => (
          <div className="glossary-entry" key={term}>
            <dt>{term}</dt>
            <dd>{definition}</dd>
          </div>
        ))}
      </dl>
      <p className="feature-footnote">
        Las definiciones son introductorias y no sustituyen la terminología especializada ni una referencia de embriología.
      </p>
    </EducationalPage>
  );
}
