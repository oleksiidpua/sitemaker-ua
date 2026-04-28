"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import SectionTag from "../ui/SectionTag";

type ServiceKey = "card" | "landing" | "corporate" | "shop";

const ICONS: Record<ServiceKey, React.ReactNode> = {
  card: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M7 9h6" />
      <path d="M7 13h4" />
      <circle cx="16.5" cy="13.5" r="1.5" />
    </svg>
  ),
  landing: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16" />
      <path d="M4 11h10" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
    </svg>
  ),
  corporate: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="8" height="16" rx="1.5" />
      <rect x="13" y="9" width="8" height="11" rx="1.5" />
      <path d="M6 8h2" />
      <path d="M6 12h2" />
      <path d="M6 16h2" />
      <path d="M16 12h2" />
      <path d="M16 16h2" />
    </svg>
  ),
  shop: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16l-1.5 10a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 7z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  ),
};

const SERVICES: { key: ServiceKey; accent: string; featured?: boolean }[] = [
  { key: "card", accent: "bg-mint/40" },
  { key: "landing", accent: "bg-lavender/40", featured: true },
  { key: "corporate", accent: "bg-peach/40" },
  { key: "shop", accent: "bg-mint/30" },
];

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionTag>{t("tag")}</SectionTag>
          <h2 className="mt-5 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SERVICES.map((s, i) => {
            const features = t.raw(`items.${s.key}.features`) as string[];
            const span = s.featured ? "lg:col-span-2 lg:row-span-1" : "";
            return (
              <motion.article
                key={s.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-lavender hover:shadow-[0_20px_60px_-20px_rgba(124,92,255,0.25)] sm:p-7 ${span}`}
              >
                <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${s.accent}`} />

                <div className="relative flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-background text-foreground transition group-hover:bg-foreground group-hover:text-surface">
                    {ICONS[s.key]}
                  </div>
                  <span className="font-display text-lg italic text-muted">{t(`items.${s.key}.price`)}</span>
                </div>

                <h3 className="relative mt-5 font-display text-2xl text-foreground sm:text-3xl">
                  {t(`items.${s.key}.name`)}
                </h3>
                <p className="relative mt-2 text-sm text-muted">
                  {t(`items.${s.key}.description`)}
                </p>

                <ul className="relative mt-5 space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-lavender-strong">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="relative mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground transition group-hover:text-lavender-strong"
                >
                  {t("cta")}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-x-1">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
