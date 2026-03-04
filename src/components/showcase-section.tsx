"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AnimatedTitle } from "@/src/components/animated-title";
import { TrackedAnchor } from "@/src/components/tracked-anchor";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

type ShowcaseItem = {
  title: string;
  niche: string;
  result: string;
  tone: "teal" | "indigo" | "slate";
};

type ShowcaseMedia = {
  src: string;
  type: "image" | "video";
  presentation: "motion" | "still";
};

type ShowcaseSectionProps = {
  badge: string;
  title: string;
  subtitle: string;
  items: ShowcaseItem[];
  cta: {
    label: string;
    href: string;
    source: string;
    locale: string;
  };
  labels: {
    media: string;
    mobile: string;
    railLabel: string;
    railBody: string;
    viewHint: string;
  };
};

const toneClasses: Record<
  ShowcaseItem["tone"],
  {
    shell: string;
  }
> = {
  teal: {
    shell: "from-white/86 via-fuchsia-100/74 to-violet-200/50 dark:from-[#1f112f] dark:via-[#2c1544] dark:to-[#130a1e]"
  },
  indigo: {
    shell: "from-white/88 via-violet-100/74 to-indigo-200/48 dark:from-[#1a102d] dark:via-[#24123c] dark:to-[#0e0919]"
  },
  slate: {
    shell: "from-white/88 via-purple-100/74 to-pink-100/42 dark:from-[#1c1028] dark:via-[#2a1635] dark:to-[#100916]"
  }
};

const showcaseMedia: ShowcaseMedia[] = [
  { src: "/showcase/showcase-3.mp4", type: "video", presentation: "motion" },
  { src: "/hero-carousel/hero-carousel-1.jpeg", type: "image", presentation: "still" },
  { src: "/showcase/showcase-1.jpeg", type: "image", presentation: "still" },
  { src: "/showcase/showcase-5.mp4", type: "video", presentation: "motion" },
  { src: "/hero-carousel/hero-carousel-2.jpeg", type: "image", presentation: "still" },
  { src: "/showcase/showcase-4.jpeg", type: "image", presentation: "still" },
  { src: "/showcase/showcase-7.mp4", type: "video", presentation: "motion" },
  { src: "/showcase/showcase-2.jpeg", type: "image", presentation: "still" },
  { src: "/showcase/showcase-6.mp4", type: "video", presentation: "motion" }
];

function ShowcaseCard({
  item,
  index
}: {
  item: ShowcaseItem;
  index: number;
}) {
  const tone = toneClasses[item.tone];
  const media = showcaseMedia[index % showcaseMedia.length];
  const isMotionMedia = media.presentation === "motion";

  return (
    <article
      className="group w-[18.5rem] shrink-0 rounded-[2.4rem] border border-border/70 bg-card/68 p-4 shadow-[0_30px_80px_rgba(35,16,58,0.10)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_42px_110px_rgba(58,28,93,0.18)] sm:w-[19.5rem] lg:w-[20.5rem]"
      aria-label={`${item.title} ${item.niche}`}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-white/50 bg-gradient-to-b p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.44)] dark:border-white/10",
          tone.shell
        )}
      >
        <div className="absolute inset-x-3 top-3 h-10 rounded-[1.2rem] border border-white/50 bg-white/56 backdrop-blur dark:border-white/10 dark:bg-white/6" />

        <div className="relative overflow-hidden rounded-[1.8rem] border border-white/15 bg-[linear-gradient(180deg,rgba(26,10,42,1),rgba(15,8,25,1))] shadow-[0_35px_90px_rgba(23,8,41,0.40)] aspect-[9/16]">
          <div className="absolute inset-0">
            {media.type === "video" ? (
              <video
                key={media.src}
                className="h-full w-full object-cover object-top"
                autoPlay={isMotionMedia}
                muted
                loop={isMotionMedia}
                playsInline
                preload={isMotionMedia ? "metadata" : "auto"}
                onLoadedMetadata={
                  isMotionMedia
                    ? undefined
                    : (event) => {
                        try {
                          event.currentTarget.currentTime = 0.2;
                        } catch {}
                      }
                }
                onSeeked={
                  isMotionMedia
                    ? undefined
                    : (event) => {
                        event.currentTarget.pause();
                      }
                }
                aria-hidden="true"
              >
                <source src={media.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={media.src}
                alt=""
                fill
                sizes="(max-width: 640px) 296px, (max-width: 1024px) 312px, 328px"
                className="object-cover object-top"
                unoptimized
              />
            )}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(8,3,15,0.04)_24%,rgba(6,2,10,0.48)_100%)]" />
        </div>
      </div>
    </article>
  );
}

export function ShowcaseSection({ badge, title, subtitle, items, cta, labels }: ShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const loopRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const isInView = useInView(sectionRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [loopWidth, setLoopWidth] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const speedRef = useRef(0);

  useEffect(() => {
    if (!loopRef.current) {
      return;
    }

    const element = loopRef.current;

    const updateWidth = () => {
      setLoopWidth(element.scrollWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [items.length]);

  useEffect(() => {
    x.set(0);
    speedRef.current = 0;
  }, [loopWidth, x]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || loopWidth === 0) {
      return;
    }

    const targetSpeed = !isInView ? 0 : isInteracting ? 9 : 26;
    speedRef.current += (targetSpeed - speedRef.current) * 0.08;

    if (Math.abs(speedRef.current) < 0.05) {
      return;
    }

    const next = x.get() - (speedRef.current * delta) / 1000;
    x.set(next <= -loopWidth ? next + loopWidth : next);
  });

  return (
    <section id="showcase" ref={sectionRef} className="section-spacing scroll-mt-28">
      <div className="section-shell">
        <div className="max-w-3xl space-y-4">
          <Badge variant="accent">{badge}</Badge>
          <AnimatedTitle
            lines={title}
            className="max-w-4xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
          />
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
          <TrackedAnchor
            href={cta.href}
            eventName="cta_click"
            payload={{ source: cta.source, locale: cta.locale }}
            variant="default"
            size="lg"
            className="mt-2 w-full sm:w-auto"
          >
            {cta.label}
          </TrackedAnchor>
        </div>
      </div>

      <div
        className="relative left-1/2 mt-10 w-screen -translate-x-1/2"
        onPointerEnter={() => setIsInteracting(true)}
        onPointerLeave={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
        onTouchCancel={() => setIsInteracting(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-[linear-gradient(90deg,rgba(244,238,255,0.94)_0%,rgba(244,238,255,0.72)_28%,rgba(244,238,255,0.22)_62%,rgba(244,238,255,0)_100%)] dark:bg-[linear-gradient(90deg,rgba(5,1,9,0.94)_0%,rgba(5,1,9,0.72)_28%,rgba(5,1,9,0.22)_62%,rgba(5,1,9,0)_100%)] sm:w-24 lg:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-[linear-gradient(270deg,rgba(244,238,255,0.94)_0%,rgba(244,238,255,0.72)_28%,rgba(244,238,255,0.22)_62%,rgba(244,238,255,0)_100%)] dark:bg-[linear-gradient(270deg,rgba(5,1,9,0.94)_0%,rgba(5,1,9,0.72)_28%,rgba(5,1,9,0.22)_62%,rgba(5,1,9,0)_100%)] sm:w-24 lg:w-32" />

        {reduceMotion ? (
          <div className="flex gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-7 lg:px-10">
            {items.map((item, index) => (
              <ShowcaseCard key={item.title} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden py-5">
            <motion.div className="flex w-max gap-5" style={{ x }}>
              <div ref={loopRef} className="flex gap-5 pr-5">
                {items.map((item, index) => (
                  <ShowcaseCard key={`${item.title}-primary`} item={item} index={index} />
                ))}
              </div>

              <div className="flex gap-5 pr-5" aria-hidden="true">
                {items.map((item, index) => (
                  <ShowcaseCard key={`${item.title}-${index}-clone`} item={item} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
