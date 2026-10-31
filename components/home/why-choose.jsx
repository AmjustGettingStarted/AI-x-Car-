"use client";

import { BadgeCheck, Calendar, Camera, Car, Shield } from "lucide-react";
import { motion, MotionConfig, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1];

const CARDS = [
  {
    title: "Wide Selection",
    copy: "Dealership inventory across makes, body styles, and budgets.",
    icon: Car,
    gradient: "from-[#24140f] via-[#0b0b0c] to-[#050505]",
    box: "left-[3%] top-[12%] h-[78%] w-[36%]",
    enter: { x: "-85vw", y: "-12vh", rotate: -18 },
    exit: { x: "26vw", y: "22vh" },
  },
  {
    title: "Easy Test Drive",
    copy: "Book a slot online in minutes, with flexible scheduling.",
    icon: Calendar,
    gradient: "from-[#10182a] via-[#0b0b0c] to-[#050505]",
    box: "left-[41%] top-[12%] h-[36%] w-[27%]",
    enter: { x: "80vw", y: "-36vh", rotate: 14 },
    exit: { x: "-6vw", y: "42vh" },
  },
  {
    title: "Secure Process",
    copy: "Verified listings and a secure booking flow from start to finish.",
    icon: Shield,
    gradient: "from-[#1a120e] via-[#111113] to-[#050505]",
    box: "left-[70%] top-[12%] h-[36%] w-[27%]",
    enter: { x: "72vw", y: "28vh", rotate: -12 },
    exit: { x: "-34vw", y: "40vh" },
  },
  {
    title: "AI Image Search",
    copy: "Upload a photo and match it to the make, model, and details.",
    icon: Camera,
    gradient: "from-[#1c1018] via-[#0b0b0c] to-[#050505]",
    box: "left-[41%] top-[50%] h-[40%] w-[27%]",
    enter: { x: "-70vw", y: "40vh", rotate: 16 },
    exit: { x: "-4vw", y: "6vh" },
  },
  {
    title: "Verified Dealer Inventory",
    copy: "Every car is listed by the dealership and checked before it is published.",
    icon: BadgeCheck,
    gradient: "from-[#140f1c] via-[#0b0b0c] to-[#050505]",
    box: "left-[70%] top-[50%] h-[40%] w-[27%]",
    enter: { x: "8vw", y: "85vh", rotate: -8 },
    exit: { x: "-32vw", y: "4vh" },
  },
];

function CardFace({ card, compact = false }) {
  const Icon = card.icon;

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
      <Icon
        className="absolute -bottom-8 -right-6 h-40 w-40 text-white/[0.05]"
        strokeWidth={1}
        aria-hidden="true"
      />
      <div
        className={`relative flex h-full flex-col justify-end ${compact ? "p-6" : "p-6 sm:p-8"}`}
      >
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#ff4d1a]/30 bg-[#ff4d1a]/10 text-[#ff4d1a]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="font-[family-name:var(--font-clash)] text-xl font-semibold uppercase leading-tight tracking-tight text-white sm:text-2xl">
          {card.title}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">
          {card.copy}
        </p>
      </div>
    </>
  );
}

function SectionTitle({ id, className = "" }) {
  return (
    <div className={className}>
      <p className="mb-3 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
        Why Ignite
      </p>
      <h2
        id={id}
        className="font-[family-name:var(--font-clash)] text-4xl font-semibold uppercase tracking-tight text-white sm:text-6xl"
      >
        Why Choose Us
      </h2>
    </div>
  );
}

function ScatterCard({ card, index, progress }) {
  const start = index * 0.04;
  const settle = 0.28 + index * 0.055;
  const fadeIn = Math.min(start + 0.08, (start + settle) / 2);

  const x = useTransform(
    progress,
    [start, settle, 0.75, 1],
    [card.enter.x, "0vw", "0vw", card.exit.x]
  );
  const y = useTransform(
    progress,
    [start, settle, 0.75, 1],
    [card.enter.y, "0vh", "0vh", card.exit.y]
  );
  const rotate = useTransform(
    progress,
    [start, settle, 0.75, 1],
    [card.enter.rotate, 0, 0, 0]
  );
  const scale = useTransform(progress, [start, settle, 0.75, 1], [0.84, 1, 1, 0.42]);
  const opacity = useTransform(progress, [start, fadeIn, 0.75, 1], [0, 1, 1, 1]);

  return (
    <motion.article
      style={{ x, y, rotate, scale, opacity, zIndex: 20 + index }}
      className={`absolute overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b0c] ${card.box}`}
    >
      <CardFace card={card} />
    </motion.article>
  );
}

function PinnedWhy() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12, 0.28], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.28], [0, -48]);

  return (
    <section
      ref={ref}
      aria-labelledby="why-choose-pinned"
      className="relative z-20 hidden h-[300vh] bg-[#050505] lg:motion-safe:block"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-x-0 top-[18%] z-10 px-6 text-center"
        >
          <SectionTitle id="why-choose-pinned" />
        </motion.div>
        {CARDS.map((card, index) => (
          <ScatterCard
            key={card.title}
            card={card}
            index={index}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function StackedWhy() {
  return (
    <section
      aria-labelledby="why-choose-stack"
      className="relative z-20 bg-[#050505] px-4 py-20 sm:px-6 lg:motion-safe:hidden"
    >
      <SectionTitle
        id="why-choose-stack"
        className="mx-auto mb-10 max-w-3xl text-center"
      />
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        {CARDS.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 72 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
            className="relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b0c]"
          >
            <CardFace card={card} compact />
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
