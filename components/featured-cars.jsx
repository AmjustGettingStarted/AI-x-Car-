"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";

const pad = (n) => String(n).padStart(2, "0");

function SectionHeading({ className = "" }) {
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <div className="min-w-0">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff4d1a]">
          Curated inventory
        </p>
        <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold uppercase leading-[0.9] text-white">
          Featured Cars
        </h2>
      </div>
      <Button
        variant="ghost"
        asChild
        className="shrink-0 cursor-pointer text-white/80 hover:bg-white/5 hover:text-white"
      >
        <Link href="/cars">
          View all <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function TrackCard({ car, index, trackX, metrics }) {
  const opacity = useTransform(trackX, (tx) => {
    if (!metrics.stride) return 1;
    const center = metrics.origin + index * metrics.stride + metrics.cardWidth / 2 + tx;
    const delta = Math.abs(center - metrics.viewport / 2);
    const t = Math.min(1, delta / metrics.stride);
    return 1 - t * 0.15;
  });

  return (
    <div
      data-featured-card
      className="h-[min(62vh,640px)] w-[min(78vw,1100px)] shrink-0 first:ml-[8vw]"
    >
      <CarCard
        car={car}
        opacity={opacity}
        priority={index === 0}
        sizes="(min-width: 768px) 78vw, 86vw"
      />
    </div>
  );
}

function PinnedTrack({ featuredCars }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const count = featuredCars.length;
  const [active, setActive] = useState(0);
  const [metrics, setMetrics] = useState({
    cardWidth: 0,
    stride: 0,
    origin: 0,
    distance: 0,
    viewport: 1,
  });

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -metrics.distance]), {
    stiffness: 120,
    damping: 28,
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [1 / Math.max(count, 1), 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(count - 1, Math.max(0, Math.round(value * (count - 1))));
    setActive((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const first = track.querySelector("[data-featured-card]");
      const cardWidth = first?.getBoundingClientRect().width || 0;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const viewport = window.innerWidth;
      const paddingRight = viewport * 0.08;
      const distance = Math.max(0, track.scrollWidth - viewport + paddingRight);
      setMetrics({
        cardWidth,
        stride: cardWidth + gap,
        origin: first?.offsetLeft || 0,
        distance,
        viewport,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [count]);

  return (
    <div ref={wrapRef} style={{ height: `calc(${count} * 55vh + 100vh)` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="px-[8vw] pb-6 pt-24">
          <SectionHeading />
        </div>

        <div className="flex min-h-0 flex-1 items-center">
          <motion.div ref={trackRef} style={{ x }} className="flex items-center gap-1 sm:gap-1.5">
            {featuredCars.map((car, index) => (
              <TrackCard
                key={car.id}
                car={car}
                index={index}
                trackX={x}
                metrics={metrics}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex items-center gap-4 px-[8vw] pb-8">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/50 font-display text-xs font-bold text-white select-none">
            N
          </div>
          <div className="h-[2px] flex-1 overflow-hidden bg-white/10">
            <motion.div
              style={{ scaleX: lineScale }}
              className="h-full w-full origin-left bg-[#ff4d1a]"
            />
          </div>
          <p className="text-xs font-mono tabular-nums tracking-[0.25em] text-white">
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
      <div className="px-4">
        <SectionHeading className="mb-8" />
      </div>
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-4 pb-4 [scroll-padding-inline:1rem]">
        {featuredCars.map((car, index) => (
          <div key={car.id} className="h-[min(62vh,640px)] w-[86vw] shrink-0 snap-center">
            <CarCard car={car} sizes="86vw" priority={index === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}

const FeaturedCars = ({ featuredCars = [] }) => {
  if (!featuredCars.length) {
    return (
      <div className="px-[8vw] py-24">
        <SectionHeading className="mb-6" />
        <p className="text-white/70">No featured cars yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:motion-safe:block">
        <PinnedTrack featuredCars={featuredCars} />
      </div>
      <div className="md:motion-safe:hidden">
        <SwipeTrack featuredCars={featuredCars} />
      </div>
    </>
  );
};

export default FeaturedCars;
