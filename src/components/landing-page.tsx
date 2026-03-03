import {
  CheckCircle2,
  LineChart,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { DemoRequestForm } from "@/src/components/demo-request-form";
import { AnimatedTitle } from "@/src/components/animated-title";
import { HeroGeometric } from "@/src/components/hero-geometric";
import { Reveal } from "@/src/components/reveal";
import { ShowcaseSection } from "@/src/components/showcase-section";
import { SiteFooter } from "@/src/components/site-footer";
import { SiteHeader } from "@/src/components/site-header";
import { TrackedAnchor } from "@/src/components/tracked-anchor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import type { AppLocale } from "@/src/i18n/routing";
import { buildStructuredData } from "@/src/lib/structured-data";

type TextItem = {
  title: string;
  description: string;
};

type ShowcaseItem = {
  title: string;
  niche: string;
  result: string;
  format: "landscape" | "portrait";
  tone: "teal" | "indigo" | "slate";
};

function SectionLead({
  badge,
  title,
  description
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <Badge variant="accent">{badge}</Badge>
      <AnimatedTitle
        lines={title}
        className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
      />
      <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
    </div>
  );
}

export async function LandingPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations();
  const demoPagePath = locale === "ro" ? "/demo-website-presentation" : "/en/demo-website-presentation";
  const showcaseItems = t.raw("showcase.items") as ShowcaseItem[];
  const benefitItems = t.raw("benefits.items") as TextItem[];
  const processItems = t.raw("socialProof.steps") as TextItem[];
  const offerIncluded = t.raw("offer.included") as string[];
  const faqItems = t.raw("faq.items") as { question: string; answer: string }[];
  const processTags = t.raw("socialProof.stepTags") as string[];
  const structuredData = buildStructuredData(locale);
  const benefitIcons = [Search, Smartphone, ShieldCheck, LineChart];

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-hero-mesh opacity-90" />
        <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(139,92,246,0.35),transparent)]" />

        <SiteHeader
          locale={locale}
          brandName={t("brand.name")}
          links={[
            { label: t("nav.examples"), href: "#showcase" },
            { label: t("nav.process"), href: "#process" },
            { label: t("nav.faq"), href: "#faq" }
          ]}
          cta={{
            label: t("nav.cta"),
            href: demoPagePath,
            source: "header_primary"
          }}
        />

        <main>
          <HeroGeometric
            badge={t("hero.eyebrow")}
            title1={t("hero.titleLine1")}
            title2={t("hero.titleLine2")}
            subtitle={t("hero.subtitle")}
            primaryCta={t("hero.primaryCta")}
            secondaryCta={t("hero.secondaryCta")}
            demoPagePath={demoPagePath}
            locale={locale}
          />

          <Reveal>
            <ShowcaseSection
              badge={t("showcase.badge")}
              title={t("showcase.title")}
              subtitle={t("showcase.subtitle")}
              items={showcaseItems}
              labels={{
                media: t("showcase.mediaLabel"),
                mobile: t("showcase.mobileLabel"),
                railLabel: t("showcase.railLabel"),
                railBody: t("showcase.railBody"),
                viewHint: t("showcase.viewHint")
              }}
            />
          </Reveal>

          <section id="form" className="section-spacing scroll-mt-28 pt-0">
            <div className="section-shell space-y-8">
              <Reveal>
                <SectionLead badge={t("form.badge")} title={t("form.sectionTitle")} description={t("form.sectionBody")} />
              </Reveal>

              <Reveal delay={0.08}>
                <DemoRequestForm />
              </Reveal>
            </div>
          </section>

          <section className="section-spacing pt-0">
            <div className="section-shell space-y-8">
              <Reveal>
                <SectionLead badge={t("benefits.badge")} title={t("benefits.title")} description={t("benefits.subtitle")} />
              </Reveal>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {benefitItems.map((item, index) => {
                  const Icon = benefitIcons[index];
                  return (
                    <Reveal key={item.title} delay={index * 0.06}>
                      <Card className="h-full rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                        <CardContent className="space-y-5 p-6">
                          <div className="inline-flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <Icon className="size-5" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="process" className="section-spacing scroll-mt-28 pt-0">
            <div className="section-shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <Reveal className="space-y-5">
                <SectionLead badge={t("socialProof.badge")} title={t("socialProof.title")} description={t("socialProof.subtitle")} />
                <Card className="rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                  <CardContent className="space-y-5 p-6 sm:p-8">
                    <h3 className="text-2xl font-semibold tracking-tight">{t("offer.includedTitle")}</h3>
                    <ul className="space-y-4">
                      {offerIncluded.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <TrackedAnchor
                      href={demoPagePath}
                      eventName="cta_click"
                      payload={{ source: "process_preview", locale }}
                      variant="default"
                      size="lg"
                      className="mt-2 w-full sm:w-auto"
                    >
                      {t("demoPage.heroPrimary")}
                    </TrackedAnchor>
                  </CardContent>
                </Card>
              </Reveal>

              <div className="grid gap-4">
                {processItems.map((item, index) => (
                  <Reveal key={item.title} delay={index * 0.06}>
                    <Card className="rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                        <div className="flex gap-4">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <Sparkles className="size-5" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">0{index + 1}</p>
                            <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="rounded-full border border-border/70 bg-background/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                          {processTags[index]}
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="section-spacing scroll-mt-28 pt-0">
            <div className="section-shell grid gap-8 lg:grid-cols-[0.76fr_1.24fr]">
              <Reveal>
                <SectionLead badge={t("faq.badge")} title={t("faq.title")} description={t("faq.subtitle")} />
              </Reveal>

              <Reveal delay={0.08}>
                <Card className="rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                  <CardContent className="p-6 sm:p-8">
                    <Accordion type="single" collapsible defaultValue="faq-0">
                      {faqItems.map((item, index) => (
                        <AccordionItem key={item.question} value={`faq-${index}`}>
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </Reveal>
            </div>
          </section>

          <section className="section-spacing pt-0">
            <div className="section-shell">
              <Reveal>
                <div className="overflow-hidden rounded-[2.8rem] border border-border/70 bg-[linear-gradient(135deg,rgba(31,12,50,0.98),rgba(76,36,122,0.96)_52%,rgba(123,82,190,0.92))] px-6 py-10 text-white shadow-[0_40px_120px_rgba(42,18,66,0.34)] sm:px-10 sm:py-12">
                  <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="space-y-4">
                      <Badge variant="muted">{t("finalCta.badge")}</Badge>
                      <AnimatedTitle
                        lines={t("finalCta.title")}
                        className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
                      />
                      <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                        {t("finalCta.subtitle")}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <TrackedAnchor
                        href={demoPagePath}
                        eventName="cta_click"
                        payload={{ source: "final_cta", locale }}
                        size="lg"
                        className="w-full border border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,227,255,0.94))] text-[#33134d] hover:bg-white sm:w-auto"
                      >
                        {t("finalCta.primary")}
                      </TrackedAnchor>
                      <p className="max-w-sm text-sm leading-relaxed text-white/62">{t("finalCta.trust")}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <SiteFooter
          locale={locale}
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
    </>
  );
}
