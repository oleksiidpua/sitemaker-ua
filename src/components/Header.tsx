"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: t("services") },
    { href: "#why", label: t("why") },
    { href: "#process", label: t("process") },
    { href: "#faq", label: t("faq") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-2xl border border-border/60 px-4 py-2.5 transition-all duration-300 sm:px-5 ${
            scrolled
              ? "bg-surface/80 shadow-[0_10px_40px_-15px_rgba(31,27,46,0.15)] backdrop-blur-xl"
              : "bg-transparent"
          }`}
        >
          <Link href="/" className="group flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-surface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12 L10 6 L14 10 L20 4" />
                <path d="M14 4h6v6" />
              </svg>
            </span>
            <span className="font-display text-xl tracking-tight text-foreground">
              Sitemaker<span className="text-lavender-strong">.UA</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted transition hover:bg-background hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <a
              href="#contact"
              className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-surface transition hover:bg-lavender-strong sm:inline-flex"
            >
              {t("cta")}
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-border md:hidden"
              aria-label="Menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-2 rounded-2xl border border-border bg-surface p-3 shadow-[0_10px_40px_-15px_rgba(31,27,46,0.15)] md:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm text-foreground hover:bg-background"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-1 rounded-xl bg-foreground px-4 py-2.5 text-center text-sm font-medium text-surface"
              >
                {t("cta")}
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
