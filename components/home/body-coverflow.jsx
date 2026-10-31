"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1];

function wrapDistance(index, active, count) {
  if (count <= 1) return 0;
  let distance = index - active;
  distance = ((distance % count) + count) % count;
  if (distance > count / 2) distance -= count;
  return distance;
}

function availableLabel(count) {
  return count === 1 ? "1 available" : `${count} available`;
}

function CoverHeading() {
  return (
    <div>
      <p className="mb-2 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
        Body styles
      </p>
      <h2 className="font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight text-white sm:text-5xl">
        Browse by Body Type
      </h2>
    </div>
  );
}

function ViewAll() {
  return (
    <Button
      variant="ghost"
      asChild
      className="cursor-pointer text-white/70 hover:bg-white/5 hover:text-white"
    >
      <Link href="/cars">
        View All <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </Button>
  );
}

function Glow({ active }) {
  const opacity = useTransform(active, (value) => {
    const distance = Math.abs(value - Math.round(value));
    return 0.4 + (1 - distance * 2) * 0.6;
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute left-1/2 top-[46%] h-[42vh] w-[min(52vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff4d1a]/40 blur-[90px]" />
    </motion.div>
  );
}

function CoverCard({ type, index, count, active }) {
  const distance = useTransform(active, (value) =>
    wrapDistance(index, value, count)
  );
  const x = useTransform(
    distance,
    (value) => `calc(-50% + ${value} * var(--cover-step))`
  );
  const y = useTransform(
    distance,
    (value) => `calc(-50% + ${Math.abs(value) * 22}px)`
  );
  const scale = useTransform(distance, (value) => {
    const amount = Math.min(Math.abs(value), 2);
    if (amount <= 1) return 1.12 - amount * 0.22;
    return 0.9 - (amount - 1) * 0.12;
  });
  const opacity = useTransform(distance, (value) => {
    const amount = Math.abs(value);
    if (amount >= 2) return 0;
    if (amount <= 1) return 1 - amount * 0.65;
    return 0.35 * (2 - amount);
  });
  const rotateY = useTransform(distance, (value) => value * -14);
  const zIndex = useTransform(distance, (value) =>
    Math.max(1, 40 - Math.round(Math.abs(value) * 10))
  );
  const pointerEvents = useTransform(distance, (value) =>
    Math.abs(value) > 1.45 ? "none" : "auto"
  );

  return (
    <motion.div
      style={{ x, y, scale, opacity, rotateY, zIndex, pointerEvents }}
      className="absolute left-1/2 top-1/2 h-[min(56vh,600px)] w-[70vw] max-w-[340px] lg:h-[60vh] lg:w-[24vw] lg:max-w-[420px]"
    >
      <Link
        href={`/cars?bodyType=${encodeURIComponent(type.name)}`}
        className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0b0c] shadow-[0_30px_80px_-36px_rgba(0,0,0,0.85)]"
        draggable={false}
      >
        {type.image ? (
          <div className="relative min-h-0 flex-1">
            <Image
              src={type.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 24vw, 70vw"
              className="object-contain object-center p-4"
              draggable={false}
            />
          </div>
        ) : (
          <div className="relative min-h-0 flex-1 bg-[radial-gradient(circle_at_center,rgba(255,77,26,0.2),transparent_68%)]" />
        )}
        <div className="px-5 pb-6">
          <h3 className="font-[family-name:var(--font-clash)] text-2xl font-semibold uppercase tracking-tight text-white">
            {type.name}
          </h3>
          <p className="mt-1 text-sm text-[#1a5cff]">{availableLabel(type.count)}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function CoverStage({
  types,
  active,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onClickCapture,
  onKeyDown,
}) {
  return (
    <div
      className="cover-stage relative h-full w-full touch-pan-y select-none outline-none"
      style={{ perspective: 1400 }}
      tabIndex={onKeyDown ? 0 : undefined}
      role="group"
      aria-label="Body type coverflow"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
    >
      <Glow active={active} />
      {types.map((type, index) => (
        <CoverCard
          key={type.name}
          type={type}
          index={index}
          count={types.length}
          active={active}
        />
      ))}
    </div>
  );
}

function PinnedCoverflow({ types }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const active = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(types.length, 1) * 2]
  );

  return (
    <section
      ref={ref}
      aria-label="Browse by Body Type"
      className="relative z-30 hidden h-[320vh] bg-[#050505] lg:motion-safe:-mt-[50vh] lg:motion-safe:block"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="flex items-end justify-between gap-4 px-6 pt-28 sm:px-10">
          <CoverHeading />
          <ViewAll />
        </div>
        <div className="relative min-h-0 flex-1">
          <CoverStage types={types} active={active} />
        </div>
      </div>
    </section>
  );
}

function SwipeCoverflow({ types }) {
  const active = useMotionValue(0);
  const drag = useRef(null);
  const suppressClick = useRef(false);

  function onPointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    suppressClick.current = false;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      index: active.get(),
      locked: null,
      dx: 0,
    };
  }

  function onPointerMove(event) {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.locked) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      current.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (current.locked === "y") {
        drag.current = null;
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (current.locked !== "x") return;
    current.dx = dx;
    active.set(current.index - dx / 210);
  }

  function finishDrag() {
    const current = drag.current;
    drag.current = null;
    if (!current || current.locked !== "x") return;
    if (Math.abs(current.dx) > 10) suppressClick.current = true;
    animate(active, Math.round(active.get()), { duration: 0.55, ease: EASE });
  }

  function onKeyDown(event) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    animate(active, Math.round(active.get()) + delta, {
      duration: 0.55,
      ease: EASE,
    });
  }

  return (
    <section
      aria-label="Browse by Body Type"
      className="relative z-30 bg-[#050505] py-16 lg:motion-safe:hidden"
    >
      <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-6">
        <CoverHeading />
        <ViewAll />
      </div>
      <div className="h-[68vh] overflow-hidden">
        <CoverStage
          types={types}
          active={active}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onClickCapture={(event) => {
            if (!suppressClick.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }}
          onKeyDown={onKeyDown}
        />
      </div>
    </section>
  );
}

export default function BodyCoverflow({ types }) {
  if (!types?.length) return null;

  return (
    <MotionConfig reducedMotion="user">
      <PinnedCoverflow types={types} />
      <SwipeCoverflow types={types} />
    </MotionConfig>
  );
}
