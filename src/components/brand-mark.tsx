import Image from "next/image";

import { cn } from "@/src/lib/utils";

type BrandMarkProps = {
  brandName: string;
  className?: string;
  imageClassName?: string;
};

export function BrandMark({ brandName, className, imageClassName }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full shadow-[0_18px_46px_rgba(108,56,255,0.22)]",
        className
      )}
    >
      <Image
        src="/brand/logo.png"
        alt={`${brandName} logo`}
        fill
        sizes="64px"
        className={cn("object-cover object-center", imageClassName)}
      />
    </div>
  );
}
