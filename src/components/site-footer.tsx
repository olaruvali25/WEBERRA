import { Instagram, Linkedin, Mail } from "lucide-react";

import { BrandMark } from "@/src/components/brand-mark";
import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";

type SiteFooterProps = {
  locale: AppLocale;
  brandName: string;
  tagline: string;
  labels: {
    privacy: string;
    terms: string;
    copyright: string;
    instagram: string;
    linkedin: string;
    emailLabel: string;
  };
};

export function SiteFooter({ locale, brandName, tagline, labels }: SiteFooterProps) {
  return (
    <footer className="border-t border-border/70 py-12 sm:py-14">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <BrandMark brandName={brandName} className="size-14 sm:size-16" />
              <div>
                <p className="text-xl font-semibold sm:text-2xl">{brandName}</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{tagline}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Pages</p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <Link href="/privacy" locale={locale} className="block transition-colors hover:text-foreground">
                  {labels.privacy}
                </Link>
                <Link href="/terms" locale={locale} className="block transition-colors hover:text-foreground">
                  {labels.terms}
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Contact</p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a
                  href="mailto:hello@weberra.ro"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4" />
                  {labels.emailLabel}
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Social</p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a
                  href="https://www.instagram.com/weberra"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Instagram className="size-4" />
                  {labels.instagram}
                </a>
                <a
                  href="https://www.linkedin.com/company/weberra"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Linkedin className="size-4" />
                  {labels.linkedin}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-5 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {brandName}. {labels.copyright}
        </div>
      </div>
    </footer>
  );
}
