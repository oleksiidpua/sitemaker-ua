"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import SectionTag from "../ui/SectionTag";

type Key = "speed" | "seo" | "responsive" | "support";

const ICONS: Record<Key, React.ReactNode> = {
  speed: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  ),
  seo: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  responsive: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="11" rx="1.5" />
      <rect x="14" y="9" width="8" height="13" rx="1.5" />
      <path d="M5 19h6" />
    </svg>
  ),
  support: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  ),
};

const KEYS: Key[] = ["speed", "seo", "responsive", "support"];

export default function Why() {
  const t = useTranslations("why");

  return (
    <section id="why" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(168,218,196,0.18),transparent_60%)]" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-32">
            <SectionTag>{t("tag")}</SectionTag>
            <h2 className="mt-5 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              {t("title")}
            </h2>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {KEYS.map((k, i) => (
              <motion.li
                key={k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group rounded-3xl border border-border bg-surface p-6 transition hover:border-lavender hover:shadow-[0_20px_60px_-20px_rgba(124,92,255,0.18)]"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lavender/30 text-lavender-strong transition group-hover:bg-foreground group-hover:text-surface">
                  {ICONS[k]}
                </div>
                <h3 className="mt-4 font-display text-2xl text-foreground">{t(`items.${k}.title`)}</h3>
                <p className="mt-2 text-sm text-muted">{t(`items.${k}.description`)}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
