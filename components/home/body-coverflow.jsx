"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { stiffness: 120, damping: 28, restDelta: 0.001 };

const CUTOUTS = {
  suv: "/body/suv-cutout.webp",
  sedan: "/body/sedan-cutout.webp",
  hatchback: "/body/hatchback-cutout.webp",
  convertible: "/body/convertible-cutout.webp",
};

function wrapDistance(index, active, count) {
  if (count <= 1) return 0;
  const raw = index - active + count / 2;
  const wrapped = ((raw % count) + count) % count;
  return wrapped - count / 2;
}

function withCutouts(types) {
  const items = (types || [])
    .filter((type) => type?.name)
    .map((type) => ({
      name: type.name,
      count: type.count ?? 0,
      image: CUTOUTS[type.name.trim().toLowerCase()] || null,
    }));
  if (items.length >= 6) return items;

  const deck = [];
  const source = items.length ? items : [];
  while (deck.length < 6 && source.length) {
    deck.push(source[deck.length % source.length]);
  }
  return deck;
}

function useCoverStep() {
  const step = useMotionValue(300);

  useEffect(() => {
    const measure = () => {
      step.set(Math.min(300, Math.max(180, window.innerWidth * 0.58)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [step]);

  return step;
}

function CoverHeading({ id }) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff4d1a]">Body styles</p>
      <h2
        id={id}
        className="font-display text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9] text-white"
      >
        Browse by Body Type
      </h2>
    </div>
  );
}

function CoverFooter({ active, deck }) {
  const count = deck.length;
  const [cursor, setCursor] = useState(0);
  const bar = useTransform(active, (value) => {
    const pos = ((value % count) + count) % count;
    return (pos + 1) / count;
  });

  useMotionValueEvent(active, "change", (value) => {
    const next = ((Math.round(value) % count) + count) % count;
    setCursor((current) => (current === next ? current : next));
  });

  const current = deck[cursor];
  const label = String(cursor + 1).padStart(2, "0");
  const total = String(count).padStart(2, "0");
  const cars = current.count === 1 ? "car" : "cars";

  return (
    <div className="px-4 sm:px-10">
      <p className="font-display text-[clamp(2rem,5vw,4rem)] leading-none text-white">{current.name}</p>
      <Link
        href={`/cars?bodyType=${encodeURIComponent(current.name)}`}
        className="mt-3 inline-flex items-center gap-1 text-base text-white/80 hover:text-[#ff4d1a]"
      >
        Explore {current.count} {cars}
        <ChevronRight className="h-4 w-4" />
      </Link>
      <div className="mt-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/15">
          <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-[#ff4d1a]" />
        </div>
        <p className="text-xs tabular-nums tracking-[0.3em] text-white">
          {label} / {total}
        </p>
      </div>
    </div>
  );
}

function CoverCard({ type, index, count, active, step, onSelect }) {
  const distance = useTransform([active, step], ([value]) => wrapDistance(index, value, count));
  const x = useTransform([active, step], ([value, stride]) => wrapDistance(index, value, count) * stride);
  const scale = useTransform(distance, (value) => 1.18 - Math.min(Math.abs(value), 3) * 0.17);
  const opacity = useTransform(distance, (value) => {
    const amount = Math.abs(value);
    if (amount > 3.5) return 0;
    return 1 - Math.min(amount, 3) * 0.28;
  });
  const rotateY = useTransform(distance, (value) => value * -7);
  const zIndex = useTransform(distance, (value) => Math.round(100 - Math.abs(value) * 10));
  const borderColor = useTransform(distance, (value) =>
    Math.abs(value) < 0.5 ? "rgba(255,77,26,0.6)" : "rgba(255,255,255,0.1)"
  );
  const wash = useTransform(distance, (value) => (Math.abs(value) < 0.5 ? 1 : 0));
  const pointerEvents = useTransform(distance, (value) => (Math.abs(value) > 3.5 ? "none" : "auto"));

  const body = (
    <>
      <motion.div style={{ opacity: wash }} className="absolute inset-0 bg-white/[0.06]" />
      <div className="relative flex h-[250px] items-center justify-center px-4">
        {type.image ? (
          <Image
            src={type.image}
            alt=""
            fill
            sizes="280px"
            className="object-contain object-center p-4"
            draggable={false}
          />
        ) : (
          <span className="font-display text-center text-[56px] uppercase leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.45)]">
            {type.name}
          </span>
        )}
      </div>
      <div className="relative px-5 pb-6">
        <h3 className="font-display text-[28px] leading-none text-white">{type.name}</h3>
        <p className="mt-2 text-sm text-white/60">{type.count} available</p>
      </div>
    </>
  );

  const className =
    "absolute left-1/2 top-1/2 -ml-[140px] -mt-[200px] flex h-[400px] w-[280px] flex-col overflow-hidden rounded-3xl border bg-gradient-to-b from-[#1b1b1f] to-[#0c0c0e] text-left";

  if (!onSelect) {
    return (
      <motion.div style={{ x, scale, opacity, rotateY, zIndex, borderColor, pointerEvents }} className={className}>
        {body}
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      style={{ x, scale, opacity, rotateY, zIndex, borderColor, pointerEvents }}
      className={`${className} cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4d1a]`}
      onClick={() => onSelect(index)}
    >
      {body}
    </motion.button>
  );
}

function CoverStage({ deck, active, step, onSelect, dragLayer }) {
  return (
    <div className="relative h-full w-full" style={{ perspective: 1400 }}>
      <div
        aria-hidden="true"
        className="cover-glow pointer-events-none absolute inset-x-0 top-[6%] h-[78%] bg-[radial-gradient(ellipse_45%_55%_at_50%_58%,rgba(255,50,20,0.5),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/10 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] bottom-3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      {deck.map((type, index) => (
        <CoverCard
          key={`${type.name}-${index}`}
          type={type}
          index={index}
          count={deck.length}
          active={active}
          step={step}
          onSelect={onSelect}
        />
      ))}
      {dragLayer}
    </div>
  );
}

function PinnedCoverflow({ deck }) {
  const ref = useRef(null);
  const step = useCoverStep();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, deck.length]);
  const active = useSpring(raw, SPRING);

  function onSelect(index) {
    const node = ref.current;
    if (!node) return;
    const start = window.scrollY + node.getBoundingClientRect().top;
    const travel = Math.max(node.offsetHeight - window.innerHeight, 1);
    window.scrollTo({
      top: start + (index / deck.length) * travel,
      behavior: "smooth",
    });
  }

  return (
    <section
      ref={ref}
      aria-labelledby="body-type-pinned"
      className="relative z-30 hidden h-[420vh] bg-[#050505] md:motion-safe:block"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="relative z-[120] bg-[#050505] px-6 pt-24 sm:px-10">
          <CoverHeading id="body-type-pinned" />
        </div>
        <div className="relative min-h-0 flex-1">
          <CoverStage deck={deck} active={active} step={step} onSelect={onSelect} />
        </div>
        <div className="relative z-[120] bg-[#050505] pb-10">
          <CoverFooter active={active} deck={deck} />
        </div>
      </div>
    </section>
  );
}

function SwipeCoverflow({ deck }) {
  const active = useMotionValue(0);
  const step = useCoverStep();
  const origin = useRef(0);

  return (
    <section aria-labelledby="body-type-swipe" className="relative z-30 bg-[#050505] py-16 md:motion-safe:hidden">
      <div className="px-4">
        <CoverHeading id="body-type-swipe" />
      </div>
      <div className="relative mt-8 h-[520px]">
        <CoverStage
          deck={deck}
          active={active}
          step={step}
          dragLayer={
            <motion.div
              className="absolute inset-0 z-[110] cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={() => {
                origin.current = active.get();
              }}
              onDrag={(_event, info) => {
                const stride = step.get() || 300;
                active.set(origin.current - info.offset.x / stride);
              }}
              onDragEnd={(event, info) => {
                const stride = step.get() || 300;
                const moved = Math.abs(info.offset.x) >= 10;
                const shift = moved
                  ? -info.offset.x / stride
                  : Math.round(
                      (event.clientX -
                        event.currentTarget.getBoundingClientRect().left -
                        event.currentTarget.getBoundingClientRect().width / 2) /
                        stride
                    );
                animate(active, Math.round(origin.current + shift), {
                  duration: 0.45,
                  ease: EASE,
                });
              }}
            />
          }
        />
      </div>
      <div className="mt-4">
        <CoverFooter active={active} deck={deck} />
      </div>
    </section>
  );
}

export default function BodyCoverflow({ types }) {
  const deck = withCutouts(types);
  if (!deck.length) return null;

  return (
    <MotionConfig reducedMotion="user">
      <PinnedCoverflow deck={deck} />
      <SwipeCoverflow deck={deck} />
    </MotionConfig>
  );
}
