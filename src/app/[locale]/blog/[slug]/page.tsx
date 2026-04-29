import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getAllSlugs, getPost } from "@/lib/blog";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  return await getAllSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if (!post) return {};

  const siteUrl = "https://sitemaker-ua.vercel.app";
  const path =
    locale === routing.defaultLocale
      ? `/blog/${slug}`
      : `/${locale}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: path,
      languages: {
        uk: `/blog/${slug}`,
        ru: `/ru/blog/${slug}`,
        en: `/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}${path}`,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Sitemaker.UA" },
    publisher: {
      "@type": "Organization",
      name: "Sitemaker.UA",
      url: "https://sitemaker-ua.vercel.app",
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t("backToList")}
          </Link>

          <header className="mt-6 mb-10 border-b border-border pb-8">
            <div className="flex items-center gap-3 text-sm text-muted">
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
            <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg text-muted">{post.description}</p>
          </header>

          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <aside className="mt-14 rounded-3xl border border-border bg-surface p-8 sm:p-10">
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="mt-3 text-muted">{t("cta.description")}</p>
            <Link
              href="/#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition hover:bg-lavender-strong"
            >
              {t("cta.button")}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </aside>
        </article>
      </main>
      <Footer />
      <FloatingActions />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}
