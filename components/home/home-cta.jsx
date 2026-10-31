"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { carMakes } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1];
const LINES = [
  ["Find", "your"],
  ["dream", "car"],
];

function MagneticLink({ href, variant, className, children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.4 });

  function onMouseMove(event) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-8, Math.min(8, dx * 0.22)));
    y.set(Math.max(-8, Math.min(8, dy * 0.22)));
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-flex"
    >
      <Button asChild variant={variant} className={className}>
        <Link href={href}>{children}</Link>
      </Button>
    </motion.div>
  );
}

function MakeMarquee() {
  const names = carMakes.map((make) => make.name);
  const loop = [...names, ...names];

  return (
    <div className="cta-marquee">
      <div className="cta-marquee-track">
        {loop.map((name, index) => (
          <span key={`${name}-${index}`} className="cta-marquee-word">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function Headline() {
  const reduce = useReducedMotion();

  return (
    <h2
      id="home-cta"
      className="font-display text-[clamp(3.5rem,11vw,11rem)] uppercase leading-[0.86] text-white"
    >
      {LINES.map((line, lineIndex) => (
        <span key={line.join("-")} className="block">
          {line.map((word, wordIndex) => (
            <span
              key={word}
              className="mx-[0.12em] inline-block overflow-hidden align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.8,
                  delay: (lineIndex * line.length + wordIndex) * 0.06,
                  ease: EASE,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}

export default function HomeCta() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="home-cta"
        className="pointer-events-auto relative z-10 flex min-h-[90vh] flex-col overflow-hidden bg-[#050505]"
      >
        <Image
          src="/hero-last-frame.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/45 to-black" />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_bottom,rgba(255,77,26,0.55),transparent_68%)]" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <Headline />
          <p className="mx-auto mt-8 max-w-xl text-base text-white/80 sm:text-lg">
            Browse this dealership’s inventory, search with a photo, and book a test drive.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <MagneticLink
              href="/cars"
              className="h-14 cursor-pointer bg-[#ff4d1a] px-8 text-base text-white hover:bg-[#ff4d1a]/90"
            >
              View all cars
            </MagneticLink>
            <MagneticLink
              href="/sign-up"
              variant="outline"
              className="h-14 cursor-pointer border-white bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
            >
              Sign up now
            </MagneticLink>
          </div>
        </div>

        <div className="relative z-10 pb-8">
          <MakeMarquee />
        </div>
      </section>
    </MotionConfig>
  );
}
