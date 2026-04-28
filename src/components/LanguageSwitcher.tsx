"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition, useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  uk: "UA",
  ru: "RU",
  en: "EN",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(next: string) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-label={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-medium tracking-wider text-foreground transition hover:border-lavender-strong hover:text-lavender-strong"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {LABELS[locale]}
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 min-w-[160px] rounded-2xl border border-border bg-surface p-1.5 shadow-[0_10px_40px_-10px_rgba(31,27,46,0.15)]"
        >
          {routing.locales.map((loc) => (
            <li key={loc}>
              <button
                role="option"
                aria-selected={loc === locale}
                onClick={() => switchTo(loc)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                  loc === locale
                    ? "bg-lavender/20 text-foreground"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <span>{t(loc as "uk" | "ru" | "en")}</span>
                <span className="text-xs tracking-wider opacity-60">{LABELS[loc]}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
