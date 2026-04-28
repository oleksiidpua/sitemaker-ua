import { useTranslations } from "next-intl";
import { CONTACTS } from "@/lib/contacts";

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "#services", label: t("nav.services") },
    { href: "#why", label: t("nav.why") },
    { href: "#process", label: t("nav.process") },
    { href: "#faq", label: t("nav.faq") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-surface">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12 L10 6 L14 10 L20 4" />
                  <path d="M14 4h6v6" />
                </svg>
              </span>
              <span className="font-display text-xl tracking-tight text-foreground">
                Sitemaker<span className="text-lavender-strong">.UA</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted">{t("footer.tagline")}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {t("footer.navTitle")}
            </p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-foreground transition hover:text-lavender-strong">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {t("footer.contactTitle")}
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground transition hover:text-lavender-strong"
                >
                  Telegram: {CONTACTS.telegramHandle}
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.emailUrl}
                  className="text-sm text-foreground transition hover:text-lavender-strong"
                >
                  {CONTACTS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">
            © {year} Sitemaker.UA. {t("footer.rights")}
          </p>
          <p className="text-xs text-muted">
            {t("footer.made")} 🇺🇦
          </p>
        </div>
      </div>
    </footer>
  );
}
