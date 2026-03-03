import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border border-white/15 bg-[linear-gradient(135deg,rgba(33,14,53,0.98),rgba(88,43,140,0.98)_55%,rgba(164,134,250,0.96))] text-white shadow-[0_18px_48px_rgba(88,43,140,0.30)] hover:-translate-y-0.5 hover:shadow-[0_24px_62px_rgba(88,43,140,0.40)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "border border-border/70 bg-white/60 text-foreground hover:bg-white/78 dark:bg-white/5 dark:hover:bg-white/10",
        accent:
          "border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(237,226,255,0.94))] text-[#34154f] shadow-[0_14px_38px_rgba(120,79,184,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(120,79,184,0.24)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(86,47,135,0.92),rgba(126,84,191,0.92))] dark:text-white dark:shadow-[0_20px_48px_rgba(88,43,140,0.28)]"
      },
      size: {
        default: "h-11 px-6",
        lg: "h-12 px-7 text-base",
        sm: "h-9 px-4 text-sm",
        icon: "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
