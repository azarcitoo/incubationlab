import EducationalPage from "../components/EducationalPage";
import { getStructureSource, structureCatalog } from "../data/structures";

export default function GlossaryPage() {
  return (
    <EducationalPage
      eyebrow="Términos clave"
      title="Glosario"
      description="Definiciones y funciones del catálogo anatómico, centralizadas para mantener la terminología coherente en toda la aplicación."
    >
      <dl className="card feature-card glossary-list">
        {Object.entries(structureCatalog).map(([term, entry]) => {
          const source = getStructureSource(entry.source);
          return (
            <div className="glossary-entry" key={term}>
              <dt>{term}</dt>
              <dd>
                <p>{entry.definition}</p>
                <p>{entry.role}</p>
                <span className="glossary-context">{entry.development}</span>
                <a className="definition-source" href={source.href} target="_blank" rel="noreferrer">
                  Fuente: {source.label}
                </a>
              </dd>
            </div>
          );
        })}
      </dl>
    </EducationalPage>
  );
}
