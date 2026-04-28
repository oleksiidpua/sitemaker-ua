"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import SectionTag from "../ui/SectionTag";
import { CONTACTS } from "@/lib/contacts";

type Errors = Partial<Record<"name" | "contact" | "message", string>>;

function validateContact(value: string) {
  const v = value.trim();
  if (!v) return "empty";
  if (v.startsWith("@") && v.length > 2) return null;
  if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(v)) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return null;
  if (/^\+?\d[\d\s\-()]{6,}$/.test(v)) return null;
  return "invalid";
}

export default function Contact() {
  const t = useTranslations("contact");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const message = String(data.get("message") || "").trim();

    const newErrors: Errors = {};
    if (!name) newErrors.name = t("form.errorRequired");

    const contactErr = validateContact(contact);
    if (contactErr === "empty") newErrors.contact = t("form.errorRequired");
    else if (contactErr === "invalid") newErrors.contact = t("form.errorContact");

    if (!message) newErrors.message = t("form.errorRequired");
    else if (message.length < 10) newErrors.message = t("form.errorShort");

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 5000);
    }, 1100);
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-surface">
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            <div className="relative bg-gradient-to-br from-foreground via-foreground to-[#2a2342] p-8 text-surface sm:p-10 lg:p-12">
              <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-lavender-strong/30 blur-3xl" aria-hidden />
              <div className="absolute -top-16 -left-12 h-48 w-48 rounded-full bg-mint/20 blur-3xl" aria-hidden />

              <div className="relative">
                <SectionTag>{t("tag")}</SectionTag>
              </div>
              <h2 className="relative mt-5 font-display text-4xl tracking-tight sm:text-5xl">
                {t("title")}
              </h2>
              <p className="relative mt-4 max-w-md text-base text-surface/80">
                {t("subtitle")}
              </p>

              <div className="relative mt-10 space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-surface/60">{t("or")}</p>
                <a
                  href={CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-surface/15 bg-surface/5 px-4 py-3 backdrop-blur transition hover:border-surface/30 hover:bg-surface/10"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface/10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.04 15.83l-.4 4.07c.58 0 .82-.25 1.12-.55l2.69-2.57 5.58 4.08c1.02.56 1.74.27 2-.95l3.62-16.97v-.01c.31-1.51-.55-2.1-1.55-1.73L1.7 9.51C.22 10.07.24 10.88 1.45 11.25l5.32 1.66 12.34-7.78c.58-.39 1.12-.18.68.21z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-surface/60">{t("telegram")}</p>
                    <p className="text-sm font-medium">{CONTACTS.telegramHandle}</p>
                  </div>
                </a>
                <a
                  href={CONTACTS.emailUrl}
                  className="flex items-center gap-3 rounded-xl border border-surface/15 bg-surface/5 px-4 py-3 backdrop-blur transition hover:border-surface/30 hover:bg-surface/10"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface/10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-surface/60">{t("email")}</p>
                    <p className="text-sm font-medium">{CONTACTS.email}</p>
                  </div>
                </a>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate className="p-8 sm:p-10 lg:p-12">
              <div className="space-y-5">
                <Field
                  name="name"
                  label={t("form.name")}
                  placeholder={t("form.namePlaceholder")}
                  error={errors.name}
                />
                <Field
                  name="contact"
                  label={t("form.contact")}
                  placeholder={t("form.contactPlaceholder")}
                  error={errors.contact}
                />
                <Field
                  name="message"
                  label={t("form.message")}
                  placeholder={t("form.messagePlaceholder")}
                  textarea
                  error={errors.message}
                />

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface/30 border-t-surface" />
                      {t("form.sending")}
                    </>
                  ) : (
                    <>
                      {t("form.submit")}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                {status === "success" ? (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-mint/30 px-4 py-3 text-sm text-foreground"
                  >
                    {t("form.success")}
                  </motion.p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  placeholder,
  textarea,
  error,
}: {
  name: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
  error?: string;
}) {
  const className = `mt-2 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition focus:outline-none focus:ring-2 focus:ring-lavender-strong/40 ${
    error ? "border-red-400" : "border-border focus:border-foreground"
  }`;
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{label}</span>
      {textarea ? (
        <textarea name={name} rows={4} placeholder={placeholder} className={`${className} resize-none`} />
      ) : (
        <input name={name} type="text" placeholder={placeholder} className={className} />
      )}
      {error ? <span className="mt-1.5 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
