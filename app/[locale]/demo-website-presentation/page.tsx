import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { DemoPresentationPage } from "@/src/components/demo-presentation-page";
import type { AppLocale } from "@/src/i18n/routing";
import { absoluteUrl } from "@/src/lib/utils";

export async function generateMetadata({
  params
}: {
  params: { locale: AppLocale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "demoPage" });
  const path = params.locale === "ro" ? "/demo-website-presentation" : "/en/demo-website-presentation";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: path,
      languages: {
        ro: absoluteUrl("/demo-website-presentation"),
        en: absoluteUrl("/en/demo-website-presentation")
      }
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: absoluteUrl(path)
    }
  };
}

export default function DemoWebsitePresentationPage({
  params
}: {
  params: { locale: AppLocale };
}) {
  unstable_setRequestLocale(params.locale);

  return <DemoPresentationPage locale={params.locale} />;
}
