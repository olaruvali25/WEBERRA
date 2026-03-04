"use client";

import { useEffect, useState } from "react";
import { LaptopMinimal, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/src/lib/utils";

const themes = [
  { value: "light", label: "Light", icon: SunMedium },
  { value: "dark", label: "Dark", icon: MoonStar },
  { value: "system", label: "System", icon: LaptopMinimal }
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme ?? "system" : "system";

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/70 bg-white/60 p-1 backdrop-blur dark:bg-white/5">
      {themes.map(({ value, label, icon: Icon }) => {
        const active = activeTheme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active &&
                "bg-[linear-gradient(135deg,rgba(39,16,63,0.98),rgba(92,48,147,0.98)_58%,rgba(164,134,250,0.95))] text-white shadow-[0_12px_30px_rgba(88,43,140,0.28)]"
            )}
            aria-label={`Switch theme to ${label}`}
            title={label}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
