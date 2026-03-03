"use client";

import { type ReactNode, useRef, useState, useTransition } from "react";
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe2,
  ImagePlus,
  Images,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Phone,
  Sparkles,
  Trash2,
  UploadCloud
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

type UploadItem = {
  id: string;
  name: string;
  url?: string;
  preview?: string;
  status: "uploading" | "done" | "error";
};

type FormValues = Omit<DemoRequestInput, "locale" | "consent"> & {
  consent: boolean;
};

type FieldName = keyof DemoRequestInput;

const totalSteps = 5;

const initialValues: FormValues = {
  businessName: "",
  businessType: "",
  city: "",
  contactName: "",
  phone: "",
  email: "",
  instagram: "",
  tiktok: "",
  facebook: "",
  website: "",
  details: "",
  imageUrls: [],
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
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const stepNames = t.raw("stepNames") as string[];
  const stepDescriptions = t.raw("stepDescriptions") as string[];
  const quickTypes = t.raw("quickTypes") as string[];
  const detailChips = t.raw("detailChips") as string[];
  const successSteps = t.raw("successSteps") as string[];
  const progress = (step / totalSteps) * 100;
  const uploadInProgress = uploads.some((item) => item.status === "uploading");
  const stepIcons = [Building2, Phone, Globe2, MessageSquareText, Images];

  function setField<K extends keyof typeof initialValues>(field: K, value: (typeof initialValues)[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setActionMessage(null);
  }

  function fieldError(type?: "email" | "phone" | "details" | "consent") {
    if (type) {
      return t(`errors.${type}`);
    }

    return t("errors.required");
  }

  function validateStep(currentStep: number) {
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (currentStep === 1) {
      if (!values.businessName.trim()) nextErrors.businessName = fieldError();
      if (!values.businessType.trim()) nextErrors.businessType = fieldError();
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

  function appendDetailChip(chip: string) {
    const nextValue = values.details.trim() ? `${values.details.trim()}\n${chip}` : chip;
    setField("details", nextValue);
  }

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (files.length + values.imageUrls.length > 6) {
      setActionMessage(t("errors.upload"));
      setStatus("error");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setActionMessage(t("errors.uploadConfig"));
      setStatus("error");
      return;
    }

    const newUploads = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      preview: URL.createObjectURL(file),
      status: "uploading" as const
    }));

    setUploads((current) => [...current, ...newUploads]);
    setStatus("idle");
    setActionMessage(null);

    await Promise.all(
      files.map(async (file, index) => {
        const localId = newUploads[index].id;
        const body = new FormData();
        body.append("file", file);
        body.append("upload_preset", uploadPreset);
        body.append("folder", "weberra/demo-requests");

        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body
          });
          const data = await response.json();

          if (!response.ok || !data.secure_url) {
            throw new Error("Upload failed");
          }

          setUploads((current) =>
            current.map((item) =>
              item.id === localId
                ? {
                    ...item,
                    status: "done",
                    url: data.secure_url
                  }
                : item
            )
          );

          setValues((current) => ({
            ...current,
            imageUrls: [...current.imageUrls, data.secure_url]
          }));
        } catch (error) {
          console.error("[cloudinaryUpload]", error);
          setUploads((current) =>
            current.map((item) =>
              item.id === localId
                ? {
                    ...item,
                    status: "error"
                  }
                : item
            )
          );
          setActionMessage(t("errors.uploadFailed"));
          setStatus("error");
        }
      })
    );
  }

  function removeUpload(id: string) {
    setUploads((current) => {
      const match = current.find((item) => item.id === id);
      if (match?.preview) {
        URL.revokeObjectURL(match.preview);
      }
      if (match?.url) {
        setValues((formState) => ({
          ...formState,
          imageUrls: formState.imageUrls.filter((url) => url !== match.url)
        }));
      }

      return current.filter((item) => item.id !== id);
    });
  }

  function submit() {
    if (!validateStep(5) || uploadInProgress) {
      return;
    }

    setActionMessage(null);
    setStatus("idle");

    startTransition(async () => {
      const result = await submitDemoRequest({
        ...values,
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
                  <Input
                    id="businessType"
                    value={values.businessType}
                    onChange={(event) => setField("businessType", event.target.value)}
                    placeholder={t("placeholders.businessType")}
                    aria-invalid={Boolean(errors.businessType)}
                    className="mt-2 h-14 rounded-[1.3rem]"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {quickTypes.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setField("businessType", item)}
                        className="rounded-full border border-border/70 bg-background/70 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
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

                <FieldShell>
                  <p className="text-sm font-medium text-foreground">{t("detailChipLabel")}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {detailChips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => appendDetailChip(chip)}
                        className="rounded-full border border-border/70 bg-background/70 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </FieldShell>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-4">
                <FieldShell>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight">{t("uploadTitle")}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{t("uploadSubtitle")}</p>
                  </div>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      if (event.target.files) {
                        void uploadFiles(event.target.files);
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragActive(true);
                    }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDragActive(false);
                      void uploadFiles(event.dataTransfer.files);
                    }}
                    className={cn(
                      "mt-5 flex min-h-60 w-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-border/80 bg-background/70 px-6 text-center transition-colors",
                      isDragActive && "border-accent bg-accent/6"
                    )}
                  >
                    <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <UploadCloud className="size-6" />
                    </div>
                    <p className="text-base font-semibold">{t("uploadDrop")}</p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{t("uploadHint")}</p>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(112,65,255,1),rgba(174,116,255,0.95))] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(112,65,255,0.22)]">
                      <ImagePlus className="size-4" />
                      {t("uploadCta")}
                    </span>
                  </button>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("uploadLater")}</p>
                </FieldShell>

                {uploads.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {uploads.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-[1.5rem] border border-border/70 bg-card/72 p-3 backdrop-blur">
                        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-secondary">
                          {item.preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.preview} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImagePlus className="size-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.status === "uploading"
                              ? t("uploadStatus.uploading")
                              : item.status === "done"
                                ? t("uploadStatus.done")
                                : t("uploadStatus.error")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeUpload(item.id)}
                          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

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
                disabled={isPending || uploadInProgress}
                className="w-full sm:w-auto"
              >
                {isPending || uploadInProgress ? (
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
