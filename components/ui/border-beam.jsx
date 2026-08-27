"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BorderBeam = ({
  className,
  duration = 6,
  delay = 0,
  borderWidth = 1.5,
  colorFrom = "#FF5F1F",
  colorTo = "#FF8F50",
  reverse = false,
  beamLength = 35, // arc degree length for the glowing beam
  style,
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden p-[1.5px]",
        className
      )}
      style={{
        padding: `${borderWidth}px`,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        ...style,
      }}
    >
      <motion.div
        className="absolute -inset-[150%] m-auto aspect-square rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent ${360 - beamLength}deg, ${colorFrom} ${360 - beamLength / 2}deg, ${colorTo} 360deg)`,
        }}
        animate={{
          rotate: reverse ? [-360, 0] : [0, 360],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
        }}
      />
    </div>
  );
};