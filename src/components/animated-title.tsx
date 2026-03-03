"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

import { cn } from "@/src/lib/utils";

type AnimatedTitleLine =
  | ReactNode
  | {
      text: ReactNode;
      className?: string;
    };

type AnimatedTitleProps<T extends ElementType> = {
  as?: T;
  lines: AnimatedTitleLine[] | ReactNode;
  className?: string;
  lineClassName?: string;
  delay?: number;
  amount?: number;
  once?: boolean;
};

const heroEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

function normalizeLine(line: AnimatedTitleLine) {
  if (typeof line === "object" && line !== null && "text" in line) {
    return line;
  }

  return { text: line, className: undefined };
}

export function AnimatedTitle<T extends ElementType = "h2">({
  as,
  lines,
  className,
  lineClassName,
  delay = 0,
  amount = 0.5,
  once = true
}: AnimatedTitleProps<T>) {
  const Tag = (as ?? "h2") as ElementType;
  const normalizedLines = Array.isArray(lines) ? lines.map(normalizeLine) : [normalizeLine(lines)];

  return (
    <Tag className={className}>
      {normalizedLines.map((line, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once, amount }}
          transition={{
            duration: 1,
            delay: delay + index * 0.2,
            ease: heroEase
          }}
          className={cn(index > 0 && "block", lineClassName, line.className)}
        >
          {line.text}
        </motion.span>
      ))}
    </Tag>
  );
}
