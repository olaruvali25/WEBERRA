import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-white/70 text-foreground dark:bg-white/5",
        accent: "border-accent/25 bg-[linear-gradient(135deg,rgba(245,238,255,0.92),rgba(233,220,255,0.9))] text-[#5b2b8c] dark:bg-[linear-gradient(135deg,rgba(94,52,148,0.24),rgba(137,92,211,0.18))] dark:text-[#d9c2ff]",
        muted: "border-white/14 bg-white/12 text-white/74"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
