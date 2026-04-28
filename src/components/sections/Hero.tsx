"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ParticleWave = dynamic(() => import("../three/ParticleWave"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <ParticleWave />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(184,164,227,0.35),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background"
        aria-hidden
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            {t("badge")}
          </span>

          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            {t("titleStart")}{" "}
            <span className="gradient-text italic">{t("titleAccent")}</span>
            <br className="hidden sm:block" /> {t("titleEnd")}
          </h1>

          <p className="mt-6 max-w-2xl text-base text-muted sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium"
            >
              {t("ctaPrimary")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/70 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur transition hover:border-foreground"
            >
              {t("ctaSecondary")}
            </a>
          </div>

          <dl className="mt-16 grid w-full grid-cols-3 gap-4 sm:gap-8">
            {(["speed", "delivery", "support"] as const).map((k, i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="rounded-2xl border border-border bg-surface/70 p-4 text-left backdrop-blur sm:p-5"
              >
                <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted sm:text-xs">
                  {t(`stats.${k}`)}
                </dt>
                <dd className="mt-1 font-display text-2xl text-foreground sm:text-3xl">
                  {t(`stats.${k}Value`)}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
