import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getAllPosts } from "@/lib/blog";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const siteUrl = "https://sitemaker-ua.vercel.app";
  const path = locale === routing.defaultLocale ? "/blog" : `/${locale}/blog`;

  return {
    title: t("indexTitle"),
    description: t("indexDescription"),
    alternates: {
      canonical: path,
      languages: {
        uk: "/blog",
        ru: "/ru/blog",
        en: "/en/blog",
      },
    },
    openGraph: {
      title: t("indexTitle"),
      description: t("indexDescription"),
      url: `${siteUrl}${path}`,
      type: "website",
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getAllPosts(locale);

  return (
    <>
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider text-muted">
              {t("tag")}
            </span>
            <h1 className="mt-5 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              {t("indexTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
              {t("indexDescription")}
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted">{t("empty")}</p>
          ) : (
            <ul className="grid gap-5">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl border border-border bg-surface p-6 transition hover:border-lavender hover:shadow-[0_10px_40px_-15px_rgba(31,27,46,0.18)] sm:p-8"
                  >
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      {post.readingTime ? (
                        <>
                          <span>·</span>
                          <span>{post.readingTime}</span>
                        </>
                      ) : null}
                    </div>
                    <h2 className="mt-3 font-display text-2xl text-foreground transition group-hover:text-lavender-strong sm:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-base text-muted">
                      {post.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-lavender-strong">
                      {t("readMore")}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition group-hover:translate-x-0.5"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
