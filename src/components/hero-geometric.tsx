"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { TrackedAnchor } from "@/src/components/tracked-anchor";
import { cn } from "@/src/lib/utils";

const DEBUG_X = false;

type HeroMediaItem = {
  src: string;
  alt: string;
  type: "image" | "video";
};

const heroShowcaseItems = [
  {
    src: "/hero-carousel/hero-carousel-1.jpeg",
    alt: "Premium hero carousel website preview 1",
    type: "image"
  },
  {
    src: "/showcase/showcase-1.jpeg",
    alt: "Showcase website preview 1",
    type: "image"
  },
  {
    src: "/hero-carousel/hero-carousel-2.jpeg",
    alt: "Premium hero carousel website preview 2",
    type: "image"
  },
  {
    src: "/showcase/showcase-2.jpeg",
    alt: "Showcase website preview 2",
    type: "image"
  },
  {
    src: "/hero-carousel/hero-carousel-3.jpeg",
    alt: "Premium hero carousel website preview 3",
    type: "image"
  },
  {
    src: "/showcase/showcase-4.jpeg",
    alt: "Showcase website preview 4",
    type: "image"
  },
  {
    src: "/hero-carousel/hero-carousel-4.jpeg",
    alt: "Premium hero carousel website preview 4",
    type: "image"
  },
  {
    src: "/hero-carousel/hero-carousel-5.jpeg",
    alt: "Premium hero carousel website preview 5",
    type: "image"
  },
  {
    src: "/hero-carousel/hero-carousel-6.jpeg",
    alt: "Premium hero carousel website preview 6",
    type: "image"
  },
  {
    src: "/hero-carousel/hero-carousel-7.jpeg",
    alt: "Premium hero carousel website preview 7",
    type: "image"
  }
] as const;

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

function HeroShowcaseCard({
  src,
  alt,
  type
}: {
  src: string;
  alt: string;
  type: HeroMediaItem["type"];
}) {
  return (
    <div className="relative w-[var(--x-card-width)] shrink-0 rounded-[clamp(18px,2.4vw,30px)] border border-white/42 bg-white/54 p-[clamp(6px,0.8vw,10px)] shadow-[0_24px_70px_rgba(55,22,96,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
      <div className="relative h-[var(--x-card-height)] overflow-hidden rounded-[clamp(14px,1.8vw,22px)] border border-white/55 bg-[#f5efff] dark:border-white/10 dark:bg-[#0d0716]">
        {type === "video" ? (
          <video
            key={src}
            className="h-full w-full object-cover object-top"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={alt}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 240px, (max-width: 1024px) 272px, 336px"
            className="object-cover object-top"
            priority={false}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_26%,rgba(11,4,20,0.22)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_22%,rgba(3,1,7,0.38)_100%)]" />
      </div>
    </div>
  );
}

function HeroShowcaseRail({
  className,
  speed,
  direction = "left",
  items
}: {
  className?: string;
  speed: number;
  direction?: "left" | "right";
  items: readonly HeroMediaItem[];
}) {
  const loopRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const [loopWidth, setLoopWidth] = useState(0);

  useEffect(() => {
    if (!loopRef.current) {
      return;
    }

    const element = loopRef.current;

    const updateWidth = () => {
      setLoopWidth(element.offsetWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    x.set(direction === "left" ? 0 : -loopWidth);
  }, [direction, loopWidth, x]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || loopWidth === 0) {
      return;
    }

    const distance = (speed * delta) / 1000;
    const current = x.get();

    if (direction === "left") {
      const next = current - distance;
      x.set(next <= -loopWidth ? next + loopWidth : next);
      return;
    }

    const next = current + distance;
    x.set(next >= 0 ? next - loopWidth : next);
  });

  return (
    <div className={cn("w-[var(--x-row-width)] overflow-hidden", className)}>
      <motion.div className="flex w-max gap-[var(--x-gap)]" style={{ x }}>
        <div ref={loopRef} className="flex gap-[var(--x-gap)] pr-[var(--x-gap)]">
          {items.map((item, index) => (
            <HeroShowcaseCard key={`${item.src}-${index}`} src={item.src} alt={item.alt} type={item.type} />
          ))}
        </div>
        <div className="flex gap-[var(--x-gap)]">
          {items.map((item, index) => (
            <HeroShowcaseCard key={`${item.src}-${index}-clone`} src={item.src} alt={item.alt} type={item.type} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function XBackground({ items }: { items: readonly HeroMediaItem[] }) {
  const debugRowClass = DEBUG_X ? "outline outline-1 outline-emerald-400/60" : "";
  const xRowBaseStyle = {
    transformOrigin: "center center"
  } as CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] overflow-hidden",
        "[--x-angle:clamp(10deg,2.2vw,16deg)]",
        "[--x-card-width:clamp(180px,38vw,420px)]",
        "[--x-card-height:clamp(110px,22vw,260px)]",
        "[--x-gap:clamp(12px,2.4vw,24px)]",
        "[--x-row-width:clamp(165vw,172vw,180vw)]",
        "[--x-row-offset:clamp(28px,5vw,64px)]",
        "[--x-anchor-shift:clamp(68px,13vw,108px)]",
        "lg:[--x-row-width:clamp(136vw,142vw,148vw)]",
        "lg:[--x-row-offset:clamp(30px,3.6vw,60px)]",
        "lg:[--x-anchor-shift:clamp(36px,3.4vw,68px)]"
      )}
    >
      <div className="absolute inset-y-0 left-0 z-[2] w-[clamp(18px,5vw,96px)] bg-[linear-gradient(90deg,rgba(244,238,255,0.94),rgba(244,238,255,0.62),transparent)] dark:bg-[linear-gradient(90deg,rgba(5,1,9,0.96),rgba(5,1,9,0.62),transparent)]" />
      <div className="absolute inset-y-0 right-0 z-[2] w-[clamp(18px,5vw,96px)] bg-[linear-gradient(270deg,rgba(244,238,255,0.94),rgba(244,238,255,0.62),transparent)] dark:bg-[linear-gradient(270deg,rgba(5,1,9,0.96),rgba(5,1,9,0.62),transparent)]" />

      <div
        className="absolute left-1/2 z-[1] h-0 w-0 -translate-x-1/2 -translate-y-1/2"
        style={{ top: "calc(50% - var(--x-anchor-shift))" }}
      >
        {DEBUG_X ? (
          <>
            <div className="absolute left-1/2 top-0 h-[200vh] w-px -translate-x-1/2 -translate-y-1/2 bg-cyan-400/70" />
            <div className="absolute left-0 top-1/2 h-px w-[220vw] -translate-x-1/2 -translate-y-1/2 bg-cyan-400/70" />
          </>
        ) : null}

        <div
          className="absolute left-0 top-0"
          style={{
            ...xRowBaseStyle,
            transform: "translate(-50%, calc(-50% - var(--x-row-offset)))"
          }}
        >
          <div
            className={debugRowClass}
            style={{
              ...xRowBaseStyle,
              transform: "rotate(var(--x-angle))"
            }}
          >
            <HeroShowcaseRail items={items} speed={25} className="opacity-[0.9]" />
          </div>
        </div>
      </div>
    </div>
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

      <XBackground items={heroShowcaseItems} />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,rgba(244,238,255,0.94)_0%,rgba(244,238,255,0.78)_22%,rgba(244,238,255,0.26)_52%,transparent_74%)] dark:bg-[radial-gradient(circle_at_center,rgba(5,1,9,0.92)_0%,rgba(5,1,9,0.74)_24%,rgba(5,1,9,0.28)_54%,transparent_76%)]" />

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
            <p className="mx-auto mb-8 mt-6 max-w-2xl px-4 text-base font-light leading-relaxed tracking-wide text-[#1f102f] sm:text-lg md:mb-10 md:text-xl dark:text-white">
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
