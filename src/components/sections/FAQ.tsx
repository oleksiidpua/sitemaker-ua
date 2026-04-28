"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTag from "../ui/SectionTag";

const KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default function FAQ() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<string | null>("q1");

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <SectionTag>{t("tag")}</SectionTag>
          <h2 className="mt-5 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h2>
        </div>

        <ul className="space-y-3">
          {KEYS.map((k) => {
            const isOpen = open === k;
            return (
              <li key={k} className="overflow-hidden rounded-2xl border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : k)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-background sm:px-6 sm:py-5"
                >
                  <span className="font-display text-lg text-foreground sm:text-xl">
                    {t(`items.${k}.question`)}
                  </span>
                  <span
                    className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border border-border transition ${
                      isOpen ? "rotate-45 bg-foreground text-surface" : "text-foreground"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-5 pb-5 text-sm text-muted sm:px-6 sm:pb-6 sm:text-base">
                        {t(`items.${k}.answer`)}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
