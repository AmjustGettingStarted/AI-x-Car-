"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import PremiumCarCard from "@/components/premium-car-card";
import { Button } from "@/components/ui/button";

const CARD_VW = 80;
const GAP_VW = 4;
const STEP_VW = CARD_VW + GAP_VW;
const SIDE_VW = (100 - CARD_VW) / 2;

const pad = (n) => String(n).padStart(2, "0");

function TrackCard({ car, index, count, progress, priority }) {
  const position = useTransform(progress, (p) => p * (count - 1) - index);
  const scale = useTransform(position, [-1, 0, 1], [0.94, 1, 0.94], {
    clamp: true,
  });
  const opacity = useTransform(position, [-1, 0, 1], [0.45, 1, 0.45], {
    clamp: true,
  });
  // Image moves against the track so it reads slower than the card.
  const imageX = useTransform(position, [-1, 0, 1], ["-6%", "0%", "6%"], {
    clamp: true,
  });

  return (
    <div
      className="h-[70vh] shrink-0"
      style={{ width: `${CARD_VW}vw`, marginRight: `${GAP_VW}vw` }}
    >
      <PremiumCarCard
        car={car}
        imageX={imageX}
        scale={scale}
        opacity={opacity}
        priority={priority}
      />
    </div>
  );
}

function SectionHeading({ className = "" }) {
  return (
    <div className={`flex items-end justify-between ${className}`}>
      <div>
        <p className="mb-2 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
          Curated inventory
        </p>
        <h2 className="font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight text-white sm:text-5xl">
          Featured Cars
        </h2>
      </div>
      <Button
        variant="ghost"
        asChild
        className="cursor-pointer text-white/70 hover:bg-white/5 hover:text-white"
      >
        <Link href="/cars">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function PinnedTrack({ featuredCars }) {
  const sectionRef = useRef(null);
  const count = featuredCars.length;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [`${SIDE_VW}vw`, `${SIDE_VW - (count - 1) * STEP_VW}vw`]
  );
  const lineScale = useTransform(scrollYProgress, [0, 1], [1 / count, 1]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${Math.max(count, 2) * 80}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="container mx-auto px-4 pt-20">
          <SectionHeading />
        </div>

        <div className="flex flex-1 items-center">
          <motion.div style={{ x }} className="flex will-change-transform">
            {featuredCars.map((car, i) => (
              <TrackCard
                key={car.id}
                car={car}
                index={i}
                count={count}
                progress={scrollYProgress}
                priority={false}
              />
            ))}
          </motion.div>
        </div>

        <div className="container mx-auto flex items-center gap-4 px-4 pb-8">
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <motion.div
              style={{ scaleX: lineScale }}
              className="h-full w-full origin-left bg-[#ff4d1a]"
            />
          </div>
          <p className="font-[family-name:var(--font-label)] text-xs tabular-nums tracking-[0.3em] text-white/70">
            {pad(active + 1)} / {pad(count)}
          </p>
        </div>
      </div>
    </div>
  );
}

function SwipeTrack({ featuredCars }) {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading className="mb-8" />
      </div>
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scroll-padding-inline:1rem]">
        {featuredCars.map((car) => (
          <div
            key={car.id}
            className="h-[70vh] w-[88vw] shrink-0 snap-center lg:w-[70vw]"
          >
            <PremiumCarCard car={car} />
          </div>
        ))}
      </div>
    </div>
  );
}

const FeaturedCars = ({ featuredCars = [] }) => {
  if (!featuredCars.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <SectionHeading className="mb-6" />
        <p className="text-white/60">No featured cars yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:motion-safe:block">
        <PinnedTrack featuredCars={featuredCars} />
      </div>
      <div className="block lg:motion-safe:hidden">
        <SwipeTrack featuredCars={featuredCars} />
      </div>
    </>
  );
};

export default FeaturedCars;
