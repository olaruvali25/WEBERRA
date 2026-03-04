import Image from "next/image";

import { cn } from "@/src/lib/utils";

type BrandMarkProps = {
  brandName: string;
  className?: string;
  imageClassName?: string;
  framed?: boolean;
};

export function BrandMark({ brandName, className, imageClassName, framed = true }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        framed &&
          "rounded-[1.15rem] border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(241,231,255,0.68))] shadow-[0_18px_46px_rgba(108,56,255,0.16)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]",
        className
      )}
    >
      <Image
        src="/brand/weberra-logo-no-background-20260304.png"
        alt={`${brandName} logo`}
        fill
        sizes="64px"
        className={cn(
          "object-contain object-center",
          framed ? "p-[8%]" : "p-0",
          imageClassName
        )}
      />
    </div>
  );
}
