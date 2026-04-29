import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getUniqueSlugs } from "@/lib/blog";

const SITE_URL = "https://sitemaker-ua.vercel.app";

function localePath(locale: string, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

function alternates(path = ""): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((l) => [l, localePath(l, path)]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogSlugs = await getUniqueSlugs();

  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: localePath(locale),
    lastModified: now,
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1.0 : 0.8,
    alternates: { languages: alternates() },
  }));

  const blogIndexEntries: MetadataRoute.Sitemap = routing.locales.map(
    (locale) => ({
      url: localePath(locale, "/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: alternates("/blog") },
    }),
  );

  const blogPostEntries: MetadataRoute.Sitemap = blogSlugs.flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: localePath(locale, `/blog/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: alternates(`/blog/${slug}`) },
    })),
  );

  return [...homeEntries, ...blogIndexEntries, ...blogPostEntries];
}
