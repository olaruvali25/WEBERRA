import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Providers } from "@/src/components/providers";
import { routing, type AppLocale } from "@/src/i18n/routing";
import { absoluteUrl } from "@/src/lib/utils";
import "@/app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: AppLocale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" });
  const basePath = params.locale === "ro" ? "/" : "/en";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://weberra.ro"),
    icons: {
      icon: absoluteUrl("/icon.svg")
    },
    title: {
      default: t("title"),
      template: `%s | Weberra`
    },
    description: t("description"),
    keywords:
      params.locale === "ro"
        ? [
            "website pentru afaceri",
            "site de prezentare premium",
            "web design premium Romania",
            "dezvoltare website business",
            "website optimizat SEO",
            "site pentru restaurant",
            "site pentru clinica",
            "site pentru salon",
            "web development Romania"
          ]
        : [
            "premium business website",
            "premium presentation website",
            "premium web design Romania",
            "business website development",
            "SEO optimized website",
            "restaurant website",
            "clinic website",
            "salon website",
            "web development Romania"
          ],
    alternates: {
      canonical: basePath,
      languages: {
        ro: absoluteUrl("/"),
        en: absoluteUrl("/en")
      }
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: absoluteUrl(basePath),
      siteName: "Weberra",
      images: [
        {
          url: absoluteUrl("/og-image.svg"),
          width: 1200,
          height: 630,
          alt: "Weberra"
        }
      ],
      locale: params.locale === "ro" ? "ro_RO" : "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [absoluteUrl("/og-image.svg")]
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: AppLocale };
}) {
  if (!routing.locales.includes(params.locale)) {
    notFound();
  }

  unstable_setRequestLocale(params.locale);
  const messages = await getMessages();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
