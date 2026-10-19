"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const destinations = [
  { href: "/", label: "Inicio" },
  { href: "/comparador", label: "Comparador" },
  { href: "/explorador", label: "Explorador" },
  { href: "/laboratorio", label: "Laboratorio" },
  { href: "/aprendizaje", label: "Cuestionario" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/glosario", label: "Glosario" },
  { href: "/acerca", label: "Acerca de" },
];

export default function SiteNavigation() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="Navegación principal">
      <div className="site-nav-inner">
        {destinations.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={pathname === href ? "site-nav-link is-current" : "site-nav-link"}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
