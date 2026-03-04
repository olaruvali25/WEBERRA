"use client";

import { type ReactNode, useState, useTransition } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe2,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Phone,
  Sparkles
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { submitDemoRequest } from "@/src/actions/submit-demo-request";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Progress } from "@/src/components/ui/progress";
import { Textarea } from "@/src/components/ui/textarea";
import { trackEvent } from "@/src/lib/analytics";
import type { DemoRequestInput } from "@/src/lib/schema";
import { cn } from "@/src/lib/utils";

type FormValues = Omit<DemoRequestInput, "locale" | "consent"> & {
  consent: boolean;
  businessTypeOther: string;
};

type FieldName = keyof DemoRequestInput;
type FormFieldName = keyof FormValues;

const totalSteps = 5;

const initialValues: FormValues = {
  businessName: "",
  businessType: "",
  businessTypeOther: "",
  city: "",
  contactName: "",
  phone: "",
  email: "",
  instagram: "",
  tiktok: "",
  facebook: "",
  website: "",
  details: "",
  consent: false,
  honey: ""
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-500">{message}</p>;
}

function FieldShell({ children }: { children: ReactNode }) {
  return <div className="rounded-[1.75rem] border border-border/70 bg-card/72 p-4 backdrop-blur sm:p-5">{children}</div>;
}

type DemoRequestFormContentProps = {
  headerTitle?: string;
  headerSubtitle?: string;
  consentNote?: string;
};

export function DemoRequestForm(props: DemoRequestFormContentProps) {
  return <DemoRequestFormContent {...props} />;
}

export function DemoRequestFormContent({
  headerTitle,
  headerSubtitle,
  consentNote
}: DemoRequestFormContentProps = {}) {
  const t = useTranslations("form");
  const locale = useLocale() as DemoRequestInput["locale"];
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FormFieldName, string>>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const stepNames = t.raw("stepNames") as string[];
  const stepDescriptions = t.raw("stepDescriptions") as string[];
  const businessTypeOptions = t.raw("quickTypes") as string[];
  const otherBusinessTypeValue = t("otherBusinessTypeValue");
  const successSteps = t.raw("successSteps") as string[];
  const progress = (step / totalSteps) * 100;
  const stepIcons = [Building2, Phone, Globe2, MessageSquareText, Sparkles];
  const isCustomBusinessType = values.businessType === otherBusinessTypeValue;

  function setField<K extends keyof typeof initialValues>(field: K, value: (typeof initialValues)[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setActionMessage(null);
  }

  function setBusinessType(value: string) {
    setValues((current) => ({
      ...current,
      businessType: value,
      businessTypeOther: value === otherBusinessTypeValue ? current.businessTypeOther : ""
    }));
    setErrors((current) => ({
      ...current,
      businessType: undefined,
      businessTypeOther: undefined
    }));
    setActionMessage(null);
  }

  function fieldError(type?: "email" | "phone" | "details" | "consent") {
    if (type) {
      return t(`errors.${type}`);
    }

    return t("errors.required");
  }

  function validateStep(currentStep: number) {
    const nextErrors: Partial<Record<FormFieldName, string>> = {};

    if (currentStep === 1) {
      if (!values.businessName.trim()) nextErrors.businessName = fieldError();
      if (!values.businessType.trim()) nextErrors.businessType = fieldError();
      if (values.businessType === otherBusinessTypeValue && !values.businessTypeOther.trim()) {
        nextErrors.businessTypeOther = fieldError();
      }
      if (!values.city.trim()) nextErrors.city = fieldError();
    }

    if (currentStep === 2) {
      if (!values.contactName.trim()) nextErrors.contactName = fieldError();
      if (values.phone.trim().length < 7) nextErrors.phone = fieldError("phone");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = fieldError("email");
    }

    if (currentStep === 4 && values.details.trim().length < 20) {
      nextErrors.details = fieldError("details");
    }

    if (currentStep === 5 && !values.consent) {
      nextErrors.consent = fieldError("consent");
    }

    setErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  }

  function nextStep() {
    if (!validateStep(step)) {
      return;
    }

    trackEvent("form_step_completed", { step, locale });
    setStep((current) => Math.min(totalSteps, current + 1));
  }

  function previousStep() {
    setStep((current) => Math.max(1, current - 1));
  }

  function submit() {
    if (!validateStep(5)) {
      return;
    }

    setActionMessage(null);
    setStatus("idle");

    startTransition(async () => {
      const { businessTypeOther, ...rest } = values;
      const result = await submitDemoRequest({
        ...rest,
        businessType: isCustomBusinessType ? businessTypeOther.trim() : values.businessType,
        consent: true,
        locale
      });

      if (result.status === "success") {
        trackEvent("form_submit_success", { locale });
        setStatus("success");
        setActionMessage(null);
        return;
      }

      trackEvent("form_submit_error", { locale });
      setStatus("error");
      setActionMessage(result.message ?? t("errors.submit"));

      if (result.fieldErrors) {
        const normalizedEntries = Object.entries(result.fieldErrors)
          .filter(([, value]) => value?.[0])
          .map(([key, value]) => [key as FieldName, value?.[0] as string]);

        setErrors((current) => ({
          ...current,
          ...Object.fromEntries(normalizedEntries)
        }));
      }
    });
  }

  if (status === "success") {
    return (
      <div className="relative overflow-hidden rounded-[2.6rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(245,238,255,0.74))] shadow-[0_35px_110px_rgba(35,16,58,0.12)] backdrop-blur dark:bg-[linear-gradient(145deg,rgba(32,14,51,0.86),rgba(15,8,24,0.82))]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(168,132,247,0.8),transparent)]" />
        <div className="grid gap-0 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="bg-[linear-gradient(160deg,rgba(15,23,42,0.98),rgba(15,23,42,0.88))] p-8 text-white sm:p-10">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-white/10 text-white">
              <Check className="size-6" />
            </div>
            <h3 className="mt-6 text-3xl font-semibold tracking-tight">{t("successTitle")}</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/72 sm:text-base">{t("successBody")}</p>
          </div>

          <div className="p-8 sm:p-10">
            <div className="grid gap-3 sm:grid-cols-3">
              {successSteps.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4 text-sm leading-relaxed text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2.6rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(245,238,255,0.74))] shadow-[0_35px_110px_rgba(35,16,58,0.12)] backdrop-blur dark:bg-[linear-gradient(145deg,rgba(32,14,51,0.86),rgba(15,8,24,0.82))]">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(168,132,247,0.8),transparent)]" />
      <div className="grid gap-0 lg:grid-cols-[0.4fr_0.6fr]">
        <aside className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(246,240,255,0.38))] p-6 dark:bg-[linear-gradient(180deg,rgba(34,12,58,0.46),rgba(10,5,18,0.14))] sm:p-8 lg:border-b-0 lg:border-r">
          <Badge variant="accent">{t("badge")}</Badge>

          <div className="mt-5 space-y-3">
            <h3 className="max-w-sm text-3xl font-semibold tracking-tight">{headerTitle ?? t("title")}</h3>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {headerSubtitle ?? t("subtitle")}
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            {stepNames.map((item, index) => {
              const Icon = stepIcons[index];
              const active = step === index + 1;
              const completed = step > index + 1;

              return (
                <div
                  key={item}
                  className={cn(
                    "flex items-start gap-3 rounded-[1.5rem] border px-4 py-4 transition-colors",
                    active
                      ? "border-violet-500/20 bg-[linear-gradient(135deg,rgba(108,56,255,0.96),rgba(150,92,255,0.88))] text-white shadow-[0_24px_60px_rgba(108,56,255,0.24)] dark:border-violet-400/20 dark:bg-[linear-gradient(135deg,rgba(86,34,178,0.96),rgba(138,92,255,0.88))]"
                      : "border-border/70 bg-white/48 text-foreground backdrop-blur dark:bg-white/[0.04]"
                  )}
                >
                  <div
                    className={cn(
                      "inline-flex size-11 shrink-0 items-center justify-center rounded-full",
                      active
                        ? "bg-white/14 text-current dark:bg-white/10"
                        : completed
                          ? "bg-accent/12 text-accent"
                          : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {completed && !active ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug">{item}</p>
                    <p
                      className={cn(
                        "mt-1.5 text-xs leading-relaxed",
                        active ? "text-white/82" : "text-muted-foreground dark:text-white/72"
                      )}
                    >
                      {stepDescriptions[index]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-[2rem] bg-[linear-gradient(160deg,rgba(34,12,58,0.98),rgba(80,28,126,0.92))] p-5 text-white shadow-[0_30px_90px_rgba(64,20,120,0.28)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">{t("stepLabel", { current: step, total: totalSteps })}</p>
            <p className="mt-2 text-lg font-semibold">{stepNames[step - 1]}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/68">{stepDescriptions[step - 1]}</p>
            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-xs uppercase tracking-[0.22em] text-white/62">
              <Sparkles className="size-3.5" />
              {t("estimated")}
            </div>
          </div>
        </aside>

        <div className="p-6 sm:p-8">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.honey}
            onChange={(event) => setField("honey", event.target.value)}
            className="hidden"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {t("stepLabel", { current: step, total: totalSteps })}
              </p>
              <h3 className="text-2xl font-semibold tracking-tight">{stepNames[step - 1]}</h3>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {stepDescriptions[step - 1]}
              </p>
            </div>

            <div className="w-full sm:max-w-[12rem]">
              <Progress value={progress} />
              <p className="mt-2 text-right text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {Math.round(progress)}%
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {step === 1 ? (
              <div className="grid gap-4">
                <FieldShell>
                  <Label htmlFor="businessName">{t("labels.businessName")}</Label>
                  <Input
                    id="businessName"
                    value={values.businessName}
                    onChange={(event) => setField("businessName", event.target.value)}
                    placeholder={t("placeholders.businessName")}
                    aria-invalid={Boolean(errors.businessName)}
                    className="mt-2 h-14 rounded-[1.3rem]"
                  />
                  <FieldError message={errors.businessName} />
                </FieldShell>

                <FieldShell>
                  <Label htmlFor="businessType">{t("labels.businessType")}</Label>
                  <div className="relative mt-3 overflow-hidden rounded-[1.65rem] border border-[#d9c4ff]/80 bg-[linear-gradient(135deg,rgba(244,236,255,0.92),rgba(232,219,255,0.86)_55%,rgba(216,197,255,0.78))] p-1 shadow-[0_20px_58px_rgba(96,48,156,0.16)] transition-all duration-300 focus-within:border-accent/50 focus-within:shadow-[0_24px_64px_rgba(96,48,156,0.22)] dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(58,26,95,0.86),rgba(28,12,46,0.94)_58%,rgba(16,8,28,0.98))] dark:shadow-[0_22px_56px_rgba(9,4,16,0.34)]">
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]" />
                    <div className="pointer-events-none absolute left-5 top-1/2 z-[1] -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,rgba(112,65,255,0.18),rgba(174,116,255,0.12))] p-2 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(168,132,247,0.08))] dark:text-white/82 dark:shadow-none">
                      <Building2 className="size-4" />
                    </div>
                    <select
                      id="businessType"
                      value={values.businessType}
                      onChange={(event) => setBusinessType(event.target.value)}
                      aria-invalid={Boolean(errors.businessType)}
                      className="relative z-[2] h-14 w-full appearance-none rounded-[1.3rem] border border-white/24 bg-[linear-gradient(135deg,rgba(235,223,255,0.62),rgba(222,206,250,0.44))] px-16 pr-12 text-sm font-medium text-[#2f174a] outline-none backdrop-blur-xl transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/8 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] dark:text-white/92"
                    >
                      <option value="">{t("placeholders.businessType")}</option>
                      {businessTypeOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-3 right-3 flex items-center rounded-full border border-white/36 bg-[linear-gradient(135deg,rgba(238,228,255,0.55),rgba(221,205,248,0.34))] px-3 text-[#5a31a0] shadow-[0_8px_18px_rgba(85,43,138,0.10)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] dark:text-white/72">
                      <ChevronDown className="size-4" />
                    </div>
                  </div>
                  {isCustomBusinessType ? (
                    <div className="mt-4">
                      <Label htmlFor="businessTypeOther">{t("labels.businessTypeOther")}</Label>
                      <Input
                        id="businessTypeOther"
                        value={values.businessTypeOther}
                        onChange={(event) => setField("businessTypeOther", event.target.value)}
                        placeholder={t("placeholders.businessTypeOther")}
                        aria-invalid={Boolean(errors.businessTypeOther)}
                        className="mt-2 h-14 rounded-[1.3rem]"
                      />
                      <FieldError message={errors.businessTypeOther} />
                    </div>
                  ) : null}
                  <FieldError message={errors.businessType} />
                </FieldShell>

                <FieldShell>
                  <Label htmlFor="city">{t("labels.city")}</Label>
                  <Input
                    id="city"
                    value={values.city}
                    onChange={(event) => setField("city", event.target.value)}
                    placeholder={t("placeholders.city")}
                    aria-invalid={Boolean(errors.city)}
                    className="mt-2 h-14 rounded-[1.3rem]"
                  />
                  <FieldError message={errors.city} />
                </FieldShell>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4">
                <FieldShell>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <Label htmlFor="contactName">{t("labels.contactName")}</Label>
                      <p className="text-xs text-muted-foreground">{t("contactHint")}</p>
                    </div>
                  </div>
                  <Input
                    id="contactName"
                    value={values.contactName}
                    onChange={(event) => setField("contactName", event.target.value)}
                    placeholder={t("placeholders.contactName")}
                    aria-invalid={Boolean(errors.contactName)}
                    className="mt-4 h-14 rounded-[1.3rem]"
                  />
                  <FieldError message={errors.contactName} />
                </FieldShell>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldShell>
                    <Label htmlFor="phone">{t("labels.phone")}</Label>
                    <Input
                      id="phone"
                      value={values.phone}
                      onChange={(event) => setField("phone", event.target.value)}
                      placeholder={t("placeholders.phone")}
                      aria-invalid={Boolean(errors.phone)}
                      className="mt-2 h-14 rounded-[1.3rem]"
                    />
                    <FieldError message={errors.phone} />
                  </FieldShell>

                  <FieldShell>
                    <Label htmlFor="email">{t("labels.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={(event) => setField("email", event.target.value)}
                      placeholder={t("placeholders.email")}
                      aria-invalid={Boolean(errors.email)}
                      className="mt-2 h-14 rounded-[1.3rem]"
                    />
                    <FieldError message={errors.email} />
                  </FieldShell>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <FieldShell>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t("linksNote")}</p>
                </FieldShell>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldShell>
                    <Label htmlFor="instagram">{t("labels.instagram")}</Label>
                    <Input
                      id="instagram"
                      value={values.instagram}
                      onChange={(event) => setField("instagram", event.target.value)}
                      placeholder={t("placeholders.instagram")}
                      className="mt-2 h-14 rounded-[1.3rem]"
                    />
                  </FieldShell>

                  <FieldShell>
                    <Label htmlFor="tiktok">{t("labels.tiktok")}</Label>
                    <Input
                      id="tiktok"
                      value={values.tiktok}
                      onChange={(event) => setField("tiktok", event.target.value)}
                      placeholder={t("placeholders.tiktok")}
                      className="mt-2 h-14 rounded-[1.3rem]"
                    />
                  </FieldShell>

                  <FieldShell>
                    <Label htmlFor="facebook">{t("labels.facebook")}</Label>
                    <Input
                      id="facebook"
                      value={values.facebook}
                      onChange={(event) => setField("facebook", event.target.value)}
                      placeholder={t("placeholders.facebook")}
                      className="mt-2 h-14 rounded-[1.3rem]"
                    />
                  </FieldShell>

                  <FieldShell>
                    <Label htmlFor="website">{t("labels.website")}</Label>
                    <Input
                      id="website"
                      value={values.website}
                      onChange={(event) => setField("website", event.target.value)}
                      placeholder={t("placeholders.website")}
                      className="mt-2 h-14 rounded-[1.3rem]"
                    />
                  </FieldShell>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4">
                <FieldShell>
                  <Label htmlFor="details">{t("labels.details")}</Label>
                  <Textarea
                    id="details"
                    value={values.details}
                    onChange={(event) => setField("details", event.target.value)}
                    placeholder={t("placeholders.details")}
                    aria-invalid={Boolean(errors.details)}
                    className="mt-2 min-h-[16rem] rounded-[1.5rem]"
                  />
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("detailsNote")}</p>
                  <FieldError message={errors.details} />
                </FieldShell>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-4">
                <FieldShell>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight">{t("submitReviewTitle")}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{t("submitReviewBody")}</p>
                  </div>
                </FieldShell>

                <FieldShell>
                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={values.consent}
                      onChange={(event) => setField("consent", event.target.checked)}
                      className="mt-1 size-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span>
                      <span className="font-medium text-foreground">{t("labels.consent")}</span>
                      <span className="mt-1 block text-muted-foreground">{consentNote ?? t("consentNote")}</span>
                    </span>
                  </label>
                  <FieldError message={errors.consent} />
                </FieldShell>
              </div>
            ) : null}
          </div>

          {actionMessage ? (
            <div
              className={cn(
                "mt-6 rounded-[1.4rem] px-4 py-3 text-sm",
                status === "error" ? "bg-red-500/10 text-red-500" : "bg-secondary text-muted-foreground"
              )}
            >
              {actionMessage}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" onClick={previousStep} disabled={step === 1 || isPending}>
              <ChevronLeft className="mr-2 size-4" />
              {t("back")}
            </Button>

            {step < totalSteps ? (
              <Button type="button" variant="default" size="lg" onClick={nextStep} className="w-full sm:w-auto">
                {t("next")}
                <ChevronRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={submit}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    {t("submit")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
