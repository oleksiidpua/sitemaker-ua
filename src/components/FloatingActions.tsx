"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACTS } from "@/lib/contacts";

export default function FloatingActions() {
  const t = useTranslations("floating");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showTop ? (
          <motion.button
            key="top"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ duration: 0.25 }}
            aria-label={t("toTop")}
            className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground shadow-[0_10px_30px_-10px_rgba(31,27,46,0.25)] transition hover:-translate-y-0.5 hover:border-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <a
        href={CONTACTS.telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("telegram")}
        className="group pointer-events-auto inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full bg-[#229ED9] pl-4 pr-5 text-white shadow-[0_15px_40px_-10px_rgba(34,158,217,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-10px_rgba(34,158,217,0.65)]"
      >
        <span className="relative grid h-9 w-9 place-items-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="relative">
            <path d="M9.04 15.83l-.4 4.07c.58 0 .82-.25 1.12-.55l2.69-2.57 5.58 4.08c1.02.56 1.74.27 2-.95l3.62-16.97v-.01c.31-1.51-.55-2.1-1.55-1.73L1.7 9.51C.22 10.07.24 10.88 1.45 11.25l5.32 1.66 12.34-7.78c.58-.39 1.12-.18.68.21z" />
          </svg>
        </span>
        <span className="hidden text-sm font-medium sm:inline">{t("telegram")}</span>
      </a>
    </div>
  );
}
