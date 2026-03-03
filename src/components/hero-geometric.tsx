"use client";

import { motion } from "framer-motion";
import { TrackedAnchor } from "@/src/components/tracked-anchor";
import { cn } from "@/src/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]"
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 }
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0]
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut"
        }}
        style={{
          width,
          height
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-[#7b55b4]/18 dark:border-white/[0.18]",
            "shadow-[0_10px_36px_0_rgba(123,85,180,0.16)] dark:shadow-[0_12px_42px_0_rgba(182,128,255,0.18)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(123,85,180,0.18),transparent_72%)] dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.24),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

type HeroGeometricProps = {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  demoPagePath: string;
  locale: string;
};

export function HeroGeometric({
  title1,
  title2,
  subtitle,
  primaryCta,
  secondaryCta,
  demoPagePath,
  locale
}: HeroGeometricProps) {
  const heroEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f4eeff] dark:bg-[#050109]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,132,247,0.28),transparent_28%),radial-gradient(circle_at_top_right,rgba(216,180,254,0.18),transparent_24%),linear-gradient(180deg,rgba(249,245,255,0.96),rgba(241,233,255,0.98))] dark:bg-[radial-gradient(circle_at_top_left,rgba(141,92,255,0.28),transparent_28%),radial-gradient(circle_at_top_right,rgba(216,180,254,0.16),transparent_26%),linear-gradient(180deg,rgba(12,4,18,0.94),rgba(8,2,12,1))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.10] via-transparent to-fuchsia-400/[0.08] blur-3xl dark:from-violet-400/[0.16] dark:to-fuchsia-300/[0.12]" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-violet-500/[0.24] dark:from-violet-300/[0.30]"
          className="left-[-10%] top-[15%] md:left-[-5%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-fuchsia-400/[0.22] dark:from-fuchsia-200/[0.24]"
          className="right-[-5%] top-[70%] md:right-[0%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-purple-400/[0.22] dark:from-purple-200/[0.26]"
          className="bottom-[5%] left-[5%] md:bottom-[10%] md:left-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-violet-300/[0.20] dark:from-violet-100/[0.22]"
          className="right-[15%] top-[10%] md:right-[20%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-fuchsia-300/[0.20] dark:from-fuchsia-100/[0.22]"
          className="left-[20%] top-[5%] md:left-[25%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 section-shell px-4 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: heroEase }}
          >
            <h1 className="text-balance text-5xl font-semibold tracking-[-0.05em] sm:text-6xl md:text-8xl">
              <span className="bg-gradient-to-b from-[#26123c] to-[#5f4485] bg-clip-text text-transparent dark:from-white dark:to-white/78">
                {title1}
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#5a31a0] via-[#2f174a] to-[#9d62e6] bg-clip-text text-transparent dark:from-violet-200 dark:via-white/90 dark:to-fuchsia-200">
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: heroEase }}
          >
            <p className="mx-auto mb-8 mt-6 max-w-2xl px-4 text-base font-light leading-relaxed tracking-wide text-black sm:text-lg md:mb-10 md:text-xl dark:text-white/48">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: heroEase }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <TrackedAnchor
              href={demoPagePath}
              eventName="cta_click"
              payload={{ source: "hero_primary", locale }}
              variant="default"
              size="lg"
              className="w-full min-w-[14rem] border-white/10 shadow-[0_22px_70px_rgba(122,63,255,0.34)] sm:w-auto"
            >
              {primaryCta}
            </TrackedAnchor>
            <TrackedAnchor
              href="#showcase"
              eventName="cta_click"
              payload={{ source: "hero_secondary", locale }}
              variant="ghost"
              size="lg"
              className="w-full min-w-[12rem] border-[#6f4d98]/18 bg-white/[0.42] text-[#2d1546] hover:bg-white/[0.58] dark:border-white/12 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.07] sm:w-auto"
            >
              {secondaryCta}
            </TrackedAnchor>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f3ebff] via-transparent to-[#f3ebff]/70 dark:from-[#050109] dark:to-[#050109]/50" />
    </section>
  );
}
