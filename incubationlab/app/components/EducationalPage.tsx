import type { ReactNode } from "react";

type EducationalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function EducationalPage({
  eyebrow,
  title,
  description,
  children,
}: EducationalPageProps) {
  return (
    <main className="app-shell educational-shell">
      <header className="page-heading educational-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>
      {children}
    </main>
  );
}
