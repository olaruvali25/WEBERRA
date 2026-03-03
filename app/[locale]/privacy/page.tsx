import type { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { AnimatedTitle } from "@/src/components/animated-title";
import { Reveal } from "@/src/components/reveal";
import { SiteFooter } from "@/src/components/site-footer";
import { SiteHeader } from "@/src/components/site-header";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import type { AppLocale } from "@/src/i18n/routing";
import { absoluteUrl } from "@/src/lib/utils";

type Section = {
  title: string;
  body: string;
};

export async function generateMetadata({
  params
}: {
  params: { locale: AppLocale };
}): Promise<Metadata> {
  return {
    title: params.locale === "ro" ? "Politica de confidentialitate" : "Privacy policy",
    alternates: {
      canonical: params.locale === "ro" ? "/privacy" : "/en/privacy",
      languages: {
        ro: absoluteUrl("/privacy"),
        en: absoluteUrl("/en/privacy")
      }
    }
  };
}

export default async function PrivacyPage({ params }: { params: { locale: AppLocale } }) {
  unstable_setRequestLocale(params.locale);
  const t = await getTranslations();
  const sections = t.raw("privacy.sections") as Section[];

  return (
    <div>
      <SiteHeader
        locale={params.locale}
        brandName={t("brand.name")}
        links={[
          { label: t("nav.examples"), href: params.locale === "ro" ? "/#showcase" : "/en#showcase" },
          { label: t("nav.process"), href: params.locale === "ro" ? "/demo-website-presentation#process" : "/en/demo-website-presentation#process" },
          { label: t("nav.faq"), href: params.locale === "ro" ? "/#faq" : "/en#faq" }
        ]}
        cta={{
          label: t("nav.cta"),
          href: params.locale === "ro" ? "/demo-website-presentation" : "/en/demo-website-presentation",
          source: "privacy_header"
        }}
      />
      <main className="section-spacing">
        <div className="section-shell max-w-4xl space-y-8">
          <Reveal>
            <Badge variant="accent">{t("footer.privacy")}</Badge>
            <AnimatedTitle
              as="h1"
              lines={t("privacy.title")}
              className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl"
            />
            <p className="mt-4 text-lg text-muted-foreground">{t("privacy.intro")}</p>
          </Reveal>

          <div className="grid gap-5">
            {sections.map((section, index) => (
              <Reveal key={section.title} delay={index * 0.04}>
                <Card className="rounded-[2rem] border-border/70 bg-background/70">
                  <CardContent className="space-y-3 p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold">{section.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter
        locale={params.locale}
        brandName={t("brand.name")}
        tagline={t("footer.tagline")}
        labels={{
          privacy: t("footer.privacy"),
          terms: t("footer.terms"),
          copyright: t("footer.copyright"),
          instagram: t("footer.instagram"),
          linkedin: t("footer.linkedin"),
          emailLabel: t("footer.emailLabel")
        }}
      />
    </div>
  );
}
