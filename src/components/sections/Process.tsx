"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import SectionTag from "../ui/SectionTag";

const STEPS = ["brief", "design", "development", "launch"] as const;

export default function Process() {
  const t = useTranslations("process");

  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionTag>{t("tag")}</SectionTag>
          <h2 className="mt-5 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h2>
        </div>

        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.li
              key={s}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl border border-border bg-surface p-6 sm:p-7"
            >
              <span className="font-display text-5xl italic text-lavender-strong/70">
                {t(`steps.${s}.number`)}
              </span>
              <h3 className="mt-4 font-display text-2xl text-foreground">
                {t(`steps.${s}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted">{t(`steps.${s}.description`)}</p>
              {i < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="hidden lg:absolute lg:top-1/2 lg:right-[-14px] lg:block lg:text-lavender-strong/40"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              ) : null}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
