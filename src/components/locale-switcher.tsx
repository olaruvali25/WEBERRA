"use client";

import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/utils";

const locales = [
  { value: "ro", label: "RO" },
  { value: "en", label: "EN" }
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/70 bg-white/60 p-1 backdrop-blur dark:bg-white/5">
      {locales.map((item) => {
        const active = locale === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => router.replace(pathname, { locale: item.value })}
            className={cn(
              "rounded-full px-3 py-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active &&
                "bg-[linear-gradient(135deg,rgba(39,16,63,0.98),rgba(92,48,147,0.98)_58%,rgba(164,134,250,0.95))] text-white shadow-[0_12px_30px_rgba(88,43,140,0.28)]"
            )}
            aria-label={`Switch language to ${item.label}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
