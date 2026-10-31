"use client";

import { BadgeCheck, Calendar, Camera, Car, Shield } from "lucide-react";
import {
  cubicBezier,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { BRAND_NAME } from "@/lib/brand";

const EASE = [0.22, 1, 0.36, 1];
const ease = cubicBezier(0.22, 1, 0.36, 1);

const ENTER = [
  { x: -1500, y: -700, r: -35 },
  { x: 1400, y: -800, r: 30 },
  { x: -1300, y: 800, r: 25 },
  { x: 1500, y: 700, r: -30 },
  { x: 0, y: -1000, r: 12 },
];

const SETTLED = [
  { x: -560, y: 70, r: -7 },
  { x: -280, y: 25, r: -3.5 },
  { x: 0, y: 0, r: 0 },
  { x: 280, y: 25, r: 3.5 },
  { x: 560, y: 70, r: 7 },
];

const EXIT_X = [-14, -7, 0, 7, 14];
const EXIT_R = [-4, -2, 0, 2, 4];

const CARDS = [
  {
    title: "Wide Selection",
    copy: "Filter this dealership’s stock by make, body style, price, and mileage.",
    icon: Car,
  },
  {
    title: "Easy Test Drive",
    copy: "Book a slot on a car that is actually on the lot, without calling the floor.",
    icon: Calendar,
  },
  {
    title: "Secure Process",
    copy: "Reservations stay on your account, and the car’s status updates from the desk.",
    icon: Shield,
  },
  {
    title: "AI Image Search",
    copy: "Upload a photo and match it to cars in this dealership’s inventory.",
    icon: Camera,
  },
  {
    title: "Verified Dealer Inventory",
    copy: "Every listing is stock this dealership holds, with price and photos from the floor.",
    icon: BadgeCheck,
  },
];

function clamp01(value) {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function segment(progress, start, end) {
  return ease(clamp01((progress - start) / (end - start)));
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function pose(progress, index, fit, exitY) {
  const enterStart = 0.05 + index * 0.07;
  const enterEnd = enterStart + 0.17;
  const enterT = segment(progress, enterStart, enterEnd);
  const exitT = segment(progress, 0.7, 0.95);
  const from = ENTER[index];
  const settled = SETTLED[index];
  const x = settled.x * fit;
  const y = settled.y;
  const rotation = settled.r;

  if (progress >= 0.7) {
    return {
      x: lerp(x, EXIT_X[index], exitT),
      y: lerp(y, exitY, exitT),
      r: lerp(rotation, EXIT_R[index], exitT),
      scale: lerp(fit, fit * 0.4, exitT),
      opacity: lerp(1, 0.9, exitT),
      line: 1,
      z: 40 + index,
    };
  }

  return {
    x: lerp(from.x, x, enterT),
    y: lerp(from.y, y, enterT),
    r: lerp(from.r, rotation, enterT),
    scale: lerp(fit * 0.6, fit, enterT),
    opacity: enterT,
    line: segment(progress, enterEnd - 0.05, enterEnd + 0.04),
    z: 20 - Math.abs(index - 2),
  };
}

function useStageFit() {
  const fit = useMotionValue(1);
  const exitY = useMotionValue(360);

  useEffect(() => {
    const measure = () => {
      // 560px offset + 150px half card + rotation slack, kept 40px inside the viewport.
      const room = window.innerWidth / 2 - 40;
      fit.set(Math.min(1, Math.max(0.45, room / 738)));
      exitY.set(window.innerHeight * 0.36);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [fit, exitY]);

  return { fit, exitY };
}

function CardFace({ card, index, line, idle = false }) {
  const Icon = card.icon;
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className={`${idle ? "why-idle " : ""}relative h-full w-full`}>
      <Icon
        className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 text-white/[0.04]"
        strokeWidth={1}
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col p-7">
        <span className="font-display text-[64px] leading-none text-white/15">{number}</span>
        <span className="mt-4 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#ff4d1a]/55 shadow-[0_0_28px_rgba(255,77,26,0.45)]">
          <Icon className="h-14 w-14 text-[#ff4d1a]" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-[28px] leading-[1.05] text-white">{card.title}</h3>
        <p className="mt-3 text-[15px] leading-snug text-white/75">{card.copy}</p>
        <div className="mt-auto h-[2px] w-full bg-white/10">
          {line ? (
            <motion.div style={{ scaleX: line }} className="h-full origin-left bg-[#ff4d1a]" />
          ) : (
            <div className="h-full bg-[#ff4d1a]" />
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ id }) {
  return (
    <>
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff4d1a]">Why {BRAND_NAME}</p>
      <h2
        id={id}
        className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-white"
      >
        Built around the drive.
      </h2>
    </>
  );
}

function ScatterCard({ card, index, progress, fit, exitY }) {
  const x = useTransform([progress, fit, exitY], ([p, f, ey]) => pose(p, index, f, ey).x);
  const y = useTransform([progress, fit, exitY], ([p, f, ey]) => pose(p, index, f, ey).y);
  const rotate = useTransform([progress, fit, exitY], ([p, f, ey]) => pose(p, index, f, ey).r);
  const scale = useTransform([progress, fit, exitY], ([p, f, ey]) => pose(p, index, f, ey).scale);
  const opacity = useTransform([progress, fit, exitY], ([p, f, ey]) => pose(p, index, f, ey).opacity);
  const line = useTransform([progress, fit, exitY], ([p, f, ey]) => pose(p, index, f, ey).line);
  const zIndex = useTransform([progress, fit, exitY], ([p, f, ey]) => pose(p, index, f, ey).z);

  return (
    <motion.article
      style={{ x, y, rotate, scale, opacity, zIndex }}
      className="absolute left-1/2 top-1/2 h-[400px] w-[300px] -ml-[150px] -mt-[200px] overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(160deg,#18181b,#0b0b0c)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      <CardFace card={card} index={index} line={line} idle />
    </motion.article>
  );
}

function PinnedWhy() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const { fit, exitY } = useStageFit();
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.72, 0.85], [1, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.15, 0.72, 0.85], [24, 0, 0, -36]);

  return (
    <section
      ref={ref}
      aria-labelledby="why-choose-pinned"
      className="relative z-20 hidden h-[340vh] rounded-t-[2.5rem] bg-[#050505] md:motion-safe:block"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-x-0 top-[10%] z-30 px-6 text-center"
        >
          <SectionTitle id="why-choose-pinned" />
        </motion.div>
        {CARDS.map((card, index) => (
          <ScatterCard
            key={card.title}
            card={card}
            index={index}
            progress={scrollYProgress}
            fit={fit}
            exitY={exitY}
          />
        ))}
      </div>
    </section>
  );
}

function StackedWhy() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="why-choose-stack"
      className="relative z-20 rounded-t-[2.5rem] bg-[#050505] px-4 py-20 md:motion-safe:hidden"
    >
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <SectionTitle id="why-choose-stack" />
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {CARDS.map((card, index) => (
          <motion.article
            key={card.title}
            initial={reduce ? false : { opacity: 0, y: 72 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }}
            className="relative h-[400px] w-full overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(160deg,#18181b,#0b0b0c)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <CardFace card={card} index={index} />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default function WhyChoose() {
  return (
    <MotionConfig reducedMotion="user">
      <PinnedWhy />
      <StackedWhy />
    </MotionConfig>
  );
}
