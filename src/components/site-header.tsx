"use client";

import type { MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Link, usePathname } from "@/src/i18n/navigation";
import { BrandMark } from "@/src/components/brand-mark";
import type { AppLocale } from "@/src/i18n/routing";
import { LocaleSwitcher } from "@/src/components/locale-switcher";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { trackEvent } from "@/src/lib/analytics";
import { cn } from "@/src/lib/utils";

type SiteHeaderLink = {
  label: string;
  href: string;
};

type SiteHeaderProps = {
  locale: AppLocale;
  brandName: string;
  links: SiteHeaderLink[];
  cta: {
    label: string;
    href: string;
    source: string;
  };
};

function HeaderLink({
  href,
  label,
  className,
  onClick
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {label}
    </a>
  );
}

export function SiteHeader({ locale, brandName, links, cta }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    closeMenu();

    if (pathname !== "/") {
      return;
    }

    event.preventDefault();

    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="section-shell relative max-w-none px-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(243,233,255,0.66))] px-3 py-3 shadow-[0_20px_70px_rgba(58,28,93,0.14)] backdrop-blur-2xl dark:bg-[linear-gradient(135deg,rgba(32,14,51,0.82),rgba(15,8,24,0.80))] sm:px-5">
          <Link href="/" locale={locale} className="flex items-center" onClick={handleBrandClick}>
            <BrandMark
              brandName={brandName}
              framed={false}
              className="h-9 w-[8.8rem] sm:h-10 sm:w-[10rem]"
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((item) => (
              <HeaderLink key={`${item.label}-${item.href}`} href={item.href} label={item.label} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitcher />
            <ThemeToggle />
            <a
              href={cta.href}
              onClick={() => trackEvent("cta_click", { source: cta.source, locale })}
              className="relative isolate inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[linear-gradient(135deg,rgba(39,16,63,0.98),rgba(92,48,147,0.98)_58%,rgba(164,134,250,0.95))] px-5 text-sm font-semibold text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.22),0_18px_42px_rgba(88,43,140,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_-1px_0_0_rgba(255,255,255,0.26),0_22px_55px_rgba(88,43,140,0.38)]"
            >
              {cta.label}
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={cta.href}
              onClick={() => {
                trackEvent("cta_click", { source: `${cta.source}_mobile_bar`, locale });
                closeMenu();
              }}
              className="relative isolate inline-flex h-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[linear-gradient(135deg,rgba(39,16,63,0.98),rgba(92,48,147,0.98)_58%,rgba(164,134,250,0.95))] px-3 text-[11px] font-semibold text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.22),0_16px_36px_rgba(88,43,140,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_-1px_0_0_rgba(255,255,255,0.26),0_20px_46px_rgba(88,43,140,0.3)] sm:h-10 sm:px-3.5 sm:text-xs"
            >
              {cta.label}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border/70 bg-white/68 text-foreground transition-colors hover:bg-white/82 dark:bg-white/5 dark:hover:bg-white/10"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="mx-auto mt-3 max-w-7xl rounded-[2rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.80),rgba(243,233,255,0.78))] p-4 shadow-[0_30px_80px_rgba(58,28,93,0.18)] backdrop-blur-2xl dark:bg-[linear-gradient(145deg,rgba(32,14,51,0.92),rgba(15,8,24,0.90))] lg:hidden">
            <div className="grid gap-3">
              {links.map((item) => (
                <HeaderLink
                  key={`${item.label}-${item.href}-mobile`}
                  href={item.href}
                  label={item.label}
                  onClick={closeMenu}
                  className="rounded-[1.25rem] border border-border/70 bg-card/65 px-4 py-4 text-foreground hover:text-accent"
                />
              ))}

              <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-border/70 bg-card/65 p-3">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
