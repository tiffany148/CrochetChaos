"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "./ThemeProvider";

const LINKS = [
  { href: "/stitches", label: "Stitches" },
  { href: "/glossary", label: "Glossary" },
  { href: "/calculators", label: "Calculators" },
  { href: "/sizes", label: "Sizes" },
  { href: "/reference", label: "Print sheets" },
  { href: "/workspace", label: "Workspace" },
  { href: "/lessons", label: "Lessons" },
];

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <header className="site-header">
        <Link className="brand" href="/">Crochet <span>Chaos</span></Link>
        <nav className="site-nav" aria-label="Main navigation">
          {LINKS.map((link) => {
            const current = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            return (
              <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
            {theme === "light" ? "Dark theme" : "Light theme"}
          </button>
        </nav>
      </header>
      <main id="content" className="page">{children}</main>
      <footer className="site-footer">Crochet Chaos · a companion for The Ultimate Crochet Bible by Tiffany Brooke</footer>
    </>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Shell>{children}</Shell>
    </ThemeProvider>
  );
}
