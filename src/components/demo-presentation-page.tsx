import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  ImageIcon,
  MailOpen,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { AnimatedTitle } from "@/src/components/animated-title";
import { DemoRequestForm } from "@/src/components/demo-request-form";
import { Reveal } from "@/src/components/reveal";
import { SiteFooter } from "@/src/components/site-footer";
import { SiteHeader } from "@/src/components/site-header";
import { TrackedAnchor } from "@/src/components/tracked-anchor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import type { AppLocale } from "@/src/i18n/routing";
import { cn } from "@/src/lib/utils";

type StepItem = {
  title: string;
  description: string;
};

type WhyCard = {
  title: string;
  description: string;
};

type WhatCard = {
  title: string;
  body: string;
};

function VisualPlaceholder({
  label,
  title,
  body,
  format = "portrait",
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  mediaTag,
  mediaTagTone = "light",
  className
}: {
  label: string;
  title: string;
  body: string;
  format?: "portrait" | "landscape";
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  mediaTag?: string;
  mediaTagTone?: "light" | "dark";
  className?: string;
}) {
  if (imageSrc) {
    return (
      <div
        className={cn(
          "glass-panel overflow-hidden rounded-[2.15rem] border border-white/14 bg-white/[0.04] p-1.5 shadow-[0_26px_84px_rgba(48,18,80,0.16)] dark:bg-white/[0.02]",
          className
        )}
      >
        <div className="relative overflow-hidden rounded-[1.7rem] border border-white/28 bg-white/40 dark:border-white/10 dark:bg-white/[0.02]">
          {mediaTag ? (
            <div
              className={cn(
                "absolute left-5 top-5 z-10 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur",
                mediaTagTone === "dark"
                  ? "border border-white/14 bg-[rgba(19,10,32,0.76)] text-white"
                  : "border border-black/10 bg-white/86 text-black"
              )}
            >
              {mediaTag}
            </div>
          ) : null}
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            width={imageWidth ?? 1600}
            height={imageHeight ?? 1000}
            sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) 46vw, 760px"
            quality={100}
            className="block h-auto w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "glass-panel overflow-hidden rounded-[2.35rem] border-border/70 p-4 shadow-[0_34px_100px_rgba(48,18,80,0.14)]",
        className
      )}
    >
      <div className="rounded-[1.85rem] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,236,255,0.78))] p-4 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(38,18,63,0.84),rgba(14,8,24,0.94))]">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-foreground/15" />
            <span className="size-2 rounded-full bg-foreground/10" />
            <span className="size-2 rounded-full bg-foreground/10" />
          </div>
        </div>

        <div
          className={cn(
            "mt-4 rounded-[1.9rem] border border-white/50 bg-background/72 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] dark:border-white/10 dark:bg-white/[0.03]",
            format === "portrait" ? "mx-auto max-w-[18rem]" : ""
          )}
        >
          <div
            className={cn(
              "overflow-hidden border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(240,232,252,0.7))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]",
              "rounded-[1.45rem] border border-dashed p-4",
              format === "portrait" ? "aspect-[10/14]" : "aspect-[16/10]"
            )}
          >
            <div className="flex h-full flex-col">
              {format === "portrait" ? (
                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-foreground/12" />
              ) : null}

              <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-white/40 bg-white/55 text-accent shadow-[0_10px_28px_rgba(96,58,164,0.12)] dark:border-white/10 dark:bg-white/[0.04]">
                {format === "portrait" ? <MonitorSmartphone className="size-5" /> : <ImageIcon className="size-5" />}
              </div>

              <div className="space-y-2">
                <div className="h-2.5 w-24 rounded-full bg-foreground/12" />
                <div className="h-2.5 w-32 rounded-full bg-foreground/10" />
                <div className="h-2.5 w-20 rounded-full bg-foreground/8" />
              </div>

              <div className="mt-auto rounded-[1.2rem] border border-white/45 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-sm font-semibold tracking-tight">{title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export async function DemoPresentationPage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations();
  const homeHref = locale === "ro" ? "/" : "/en";
  const whatCards = t.raw("demoPage.whatCards") as WhatCard[];
  const receives = t.raw("demoPage.receives") as string[];
  const processSteps = t.raw("demoPage.processSteps") as StepItem[];
  const needs = t.raw("demoPage.needs") as string[];
  const whyCards = t.raw("demoPage.whyCards") as WhyCard[];
  const faqItems = t.raw("demoPage.faq") as { question: string; answer: string }[];
  const processIcons = [FileText, Search, Sparkles, MailOpen];
  const whyIcons = [Sparkles, ShieldCheck, CheckCircle2];

  return (
    <div className="relative overflow-hidden">
      <SiteHeader
        locale={locale}
        brandName={t("brand.name")}
        links={[
          { label: t("nav.examples"), href: `${homeHref}#showcase` },
          { label: t("nav.process"), href: "#process" },
          { label: t("nav.faq"), href: "#faq" }
        ]}
        cta={{
          label: t("nav.cta"),
          href: "#form",
          source: "demo_header"
        }}
      />

      <main className="pt-28 sm:pt-32">
        <section className="section-shell pb-14 pt-6 sm:pb-16 lg:pb-20 lg:pt-10">
          <Reveal className="space-y-6 lg:space-y-8">
            <Badge variant="accent">{t("demoPage.heroBadge")}</Badge>
            <AnimatedTitle
              as="h1"
              lines={t("demoPage.heroTitle")}
              className="max-w-6xl text-balance text-[3.3rem] font-semibold leading-[0.92] tracking-[-0.05em] sm:text-[4.35rem] lg:text-[5.6rem] xl:text-[6.2rem]"
            />
          </Reveal>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <Reveal className="space-y-8 pt-1">
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-[1.14rem]">
                {t("demoPage.heroSubtitle")}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <TrackedAnchor
                  href="#form"
                  eventName="cta_click"
                  payload={{ source: "demo_page_primary", locale }}
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {t("demoPage.heroPrimary")}
                </TrackedAnchor>
                <TrackedAnchor
                  href="#process"
                  eventName="cta_click"
                  payload={{ source: "demo_page_secondary", locale }}
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {t("demoPage.heroSecondary")}
                </TrackedAnchor>
              </div>

              <div className="grid gap-3 sm:max-w-xl sm:grid-cols-2">
                <div className="rounded-[1.45rem] border border-border/70 bg-card/72 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {t("demoPage.heroCardOneLabel")}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed">{t("demoPage.heroCardOneBody")}</p>
                </div>
                <div className="rounded-[1.45rem] border border-border/70 bg-card/72 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {t("demoPage.heroCardTwoLabel")}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed">{t("demoPage.heroCardTwoBody")}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <VisualPlaceholder
                label={t("demoPage.heroVisualLabel")}
                title={t("demoPage.heroVisualTitle")}
                body={t("demoPage.heroVisualBody")}
                format="portrait"
                imageSrc="/demo-page/section-1-card-photo.jpg"
                imageAlt="Preview of the premium website demo hero section"
                imageWidth={5184}
                imageHeight={3456}
                className="mx-auto w-full max-w-[38rem] lg:max-w-[42rem]"
              />
            </Reveal>
          </div>
        </section>

        <section className="section-spacing pt-0">
          <div className="section-shell space-y-8">
            <Reveal>
              <SectionLead
                badge={t("demoPage.whatBadge")}
                title={t("demoPage.whatTitle")}
                description={t("demoPage.whatBody")}
              />
            </Reveal>

            <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
              <Reveal>
                <div className="space-y-5">
                  <VisualPlaceholder
                    label={t("demoPage.whatVisualLabel")}
                    title={t("demoPage.whatVisualTitle")}
                    body={t("demoPage.whatVisualBody")}
                    format="landscape"
                    imageSrc="/demo-page/section-2-card-photo.jpg"
                    imageAlt="Preview of the website demo deliverable section"
                    imageWidth={6000}
                    imageHeight={4000}
                  />
                  <Card className="rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                    <CardContent className="space-y-5 p-6 sm:p-8">
                      <h2 className="text-2xl font-semibold tracking-tight">{t("demoPage.receivesTitle")}</h2>
                      <ul className="space-y-4">
                        {receives.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </Reveal>

              <div className="grid gap-4 md:grid-cols-2">
                {whatCards.map((item, index) => (
                  <Reveal key={item.title} delay={index * 0.06}>
                    <Card className="h-full rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                      <CardContent className="space-y-4 p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          0{index + 1}
                        </p>
                        <h2 className="text-2xl font-semibold tracking-tight">{item.title}</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}

                <Reveal delay={0.18}>
                  <Card className="h-full overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(60,25,101,0.96),rgba(103,57,165,0.94)_58%,rgba(169,136,248,0.9))] text-white shadow-[0_34px_90px_rgba(79,39,138,0.34)]">
                    <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
                      <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">
                          {t("demoPage.whatCtaLabel")}
                        </p>
                        <div className="space-y-3">
                          <p className="text-lg font-semibold tracking-tight text-white">{t("demoPage.whatCtaTitle")}</p>
                          <p className="text-sm leading-relaxed text-white/72">{t("demoPage.whatCtaBody")}</p>
                        </div>
                      </div>
                      <TrackedAnchor
                        href="#form"
                        eventName="cta_click"
                        payload={{ source: "demo_page_mid_primary", locale }}
                        variant="default"
                        className="w-full justify-between border-white/20 bg-[linear-gradient(135deg,rgba(48,18,82,0.98),rgba(101,51,170,0.98)_55%,rgba(181,149,255,0.94))] shadow-[inset_-1px_0_0_rgba(255,255,255,0.22),0_20px_54px_rgba(54,18,96,0.34)] hover:shadow-[inset_-1px_0_0_rgba(255,255,255,0.26),0_26px_68px_rgba(54,18,96,0.42)]"
                      >
                        {t("demoPage.whatCtaButton")}
                        <ArrowRight className="size-4" />
                      </TrackedAnchor>
                    </CardContent>
                  </Card>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="section-spacing scroll-mt-28 pt-0">
          <div className="section-shell space-y-10">
            <Reveal>
              <SectionLead
                badge={t("demoPage.processBadge")}
                title={t("demoPage.processTitle")}
                description={t("demoPage.processIntro")}
              />
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
              <Reveal>
                <div className="sticky top-28 space-y-4">
                  <VisualPlaceholder
                    label={t("demoPage.processVisualLabel")}
                    title={t("demoPage.processVisualTitle")}
                    body={t("demoPage.processVisualBody")}
                    format="portrait"
                    imageSrc="/demo-page/section-3-card-photo.jpg"
                    imageAlt="Preview of the website demo process section"
                    imageWidth={3500}
                    imageHeight={2333}
                  />
                  <Card className="rounded-[1.8rem] border-border/70 bg-card/72 backdrop-blur">
                    <CardContent className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {t("demoPage.processSideLabel")}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("demoPage.processSideBody")}</p>
                    </CardContent>
                  </Card>
                </div>
              </Reveal>

              <div className="grid gap-4">
                {processSteps.map((item, index) => {
                  const Icon = processIcons[index];
                  return (
                    <Reveal key={item.title} delay={index * 0.06}>
                      <Card className="rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                          <div className="flex gap-4">
                            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                              <Icon className="size-5" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-muted-foreground">0{index + 1}</p>
                              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                          <div className="rounded-full border border-border/70 bg-background/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            {t(`demoPage.processTag${index + 1}`)}
                          </div>
                        </CardContent>
                      </Card>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section-spacing pt-0">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="space-y-5">
                <SectionLead
                  badge={t("demoPage.needsBadge")}
                  title={t("demoPage.needsTitle")}
                  description={t("demoPage.needsIntro")}
                />
                <VisualPlaceholder
                  label={t("demoPage.needsVisualLabel")}
                  title={t("demoPage.needsVisualTitle")}
                  body={t("demoPage.needsVisualBody")}
                  format="landscape"
                  imageSrc="/demo-page/section-4-before.png"
                  imageAlt="Before example for the website demo presentation page"
                  imageWidth={1918}
                  imageHeight={930}
                  mediaTag={t("demoPage.beforeTag")}
                  mediaTagTone="light"
                />
                <Card className="rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                  <CardContent className="space-y-4 p-6 sm:p-8">
                    {needs.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid gap-5">
                <VisualPlaceholder
                  label={t("demoPage.briefVisualLabel")}
                  title={t("demoPage.briefVisualTitle")}
                  body={t("demoPage.briefVisualBody")}
                  format="landscape"
                  imageSrc="/demo-page/section-4-after.png"
                  imageAlt="After example for the website demo presentation page"
                  imageWidth={1898}
                  imageHeight={951}
                  mediaTag={t("demoPage.afterTag")}
                  mediaTagTone="dark"
                />

                <div className="space-y-3">
                  <Badge variant="accent">{t("demoPage.whyBadge")}</Badge>
                  <AnimatedTitle
                    lines={t("demoPage.whyTitle")}
                    className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
                  />
                  <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{t("demoPage.whyIntro")}</p>
                </div>

                {whyCards.map((item, index) => {
                  const Icon = whyIcons[index];
                  return (
                    <Card key={item.title} className="rounded-[2rem] border-border/70 bg-card/72 backdrop-blur">
                      <CardContent className="flex gap-4 p-6">
                        <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Icon className="size-5" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="form" className="section-spacing scroll-mt-28 pt-0">
          <div className="section-shell space-y-8">
            <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionLead
                badge={t("form.badge")}
                title={t("demoPage.formTitle")}
                description={t("demoPage.formBody")}
              />
              <div className="rounded-[1.75rem] border border-border/70 bg-card/72 p-5 backdrop-blur lg:max-w-sm">
                <p className="text-sm leading-relaxed text-muted-foreground">{t("demoPage.formAside")}</p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <DemoRequestForm
                headerTitle={t("demoPage.formTitle")}
                headerSubtitle={t("demoPage.formBody")}
                consentNote={t("demoPage.formConsentNote")}
              />
            </Reveal>
          </div>
        </section>

        <section id="faq" className="section-spacing scroll-mt-28 pt-0">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <SectionLead
                badge={t("demoPage.faqBadge")}
                title={t("demoPage.faqTitle")}
                description={t("demoPage.faqIntro")}
              />
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
                    <Badge variant="muted">{t("demoPage.finalBadge")}</Badge>
                    <AnimatedTitle
                      lines={t("demoPage.finalTitle")}
                      className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
                    />
                    <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                      {t("demoPage.finalBody")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <TrackedAnchor
                      href="#form"
                      eventName="cta_click"
                      payload={{ source: "demo_page_final", locale }}
                      size="lg"
                      className="w-full border border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,227,255,0.94))] text-[#33134d] hover:bg-white sm:w-auto"
                    >
                      {t("demoPage.heroPrimary")}
                    </TrackedAnchor>
                    <TrackedAnchor
                      href={`${homeHref}#showcase`}
                      eventName="cta_click"
                      payload={{ source: "demo_page_back_home", locale }}
                      variant="ghost"
                      size="lg"
                      className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
                    >
                      {t("demoPage.backHome")}
                    </TrackedAnchor>
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
  );
}
