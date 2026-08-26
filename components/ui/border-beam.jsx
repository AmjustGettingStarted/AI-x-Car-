"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BorderBeam = ({
    className,
    size = 120,
    delay = 0,
    duration = 8,
    colorFrom = "#ff6600",
    colorTo = "#ffaa40",
    transition,
    style,
    reverse = false,
    initialOffset = 0,
    borderWidth = 1.5,
}) => {
    return (
        <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
            style={{
                borderWidth: `${borderWidth}px`,
            }}
        >
            <motion.div
                className={cn(
                    "absolute aspect-square bg-gradient-to-l from-(--color-from) via-(--color-to) to-transparent",
                    className
                )}
                style={{
                    width: size,
                    offsetPath: `rect(0 auto auto 0 round ${size}px)`,
                    "--color-from": colorFrom,
                    "--color-to": colorTo,
                    ...style,
                }}
                initial={{ offsetDistance: `${initialOffset}%` }}
                animate={{
                    offsetDistance: reverse
                        ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
                        : [`${initialOffset}%`, `${100 + initialOffset}%`],
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration,
                    delay: -delay,
                    ...transition,
                }}
            />
        </div>
    );
};