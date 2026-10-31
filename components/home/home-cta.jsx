"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { carMakes } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1];
const LINES = [
  ["Ready", "to", "find"],
  ["your", "dream", "car?"],
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
    x.set(Math.max(-14, Math.min(14, dx * 0.28)));
    y.set(Math.max(-10, Math.min(10, dy * 0.28)));
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
      <Button asChild size="lg" variant={variant} className={className}>
        <Link href={href}>{children}</Link>
      </Button>
    </motion.div>
  );
}

function MakeMarquee() {
  const names = carMakes.map((make) => make.name);

  return (
    <div className="marquee">
      <div
        className="marquee-track items-center"
        style={{ "--marquee-duration": "72s" }}
      >
        {names.map((name) => (
          <span
            key={name}
            className="px-6 font-[family-name:var(--font-clash)] text-xs uppercase tracking-[0.35em] text-white/45"
          >
            {name}
          </span>
        ))}
        {names.map((name) => (
          <span
            key={`clone-${name}`}
            data-clone="true"
            aria-hidden="true"
            className="px-6 font-[family-name:var(--font-clash)] text-xs uppercase tracking-[0.35em] text-white/45"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomeCta() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="home-cta"
        className="relative z-30 flex min-h-[100svh] flex-col overflow-hidden bg-[#050505]"
      >
        <Image
          src="/hero-last-frame.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50 motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-last-frame.jpg"
          src="/hero/car_reveal.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/75 via-[#050505]/50 to-[#050505]" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <h2
            id="home-cta"
            className="font-[family-name:var(--font-clash)] text-[clamp(3.2rem,8vw,8.75rem)] font-semibold uppercase leading-[0.88] tracking-[-0.03em] text-white"
          >
            {LINES.map((line, lineIndex) => (
              <span key={line.join("-")} className="block">
                {line.map((word, wordIndex) => (
                  <span
                    key={word}
                    className="mx-[0.14em] inline-block overflow-hidden align-bottom"
                  >
                    <motion.span
                      className="inline-block"
                      initial={{ y: "120%", opacity: 0 }}
                      whileInView={{ y: "0%", opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{
                        duration: 0.8,
                        delay: lineIndex * 0.12 + wordIndex * 0.06,
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
          <p className="mx-auto mt-6 max-w-xl text-base text-white/70 sm:text-lg">
            Browse verified dealership inventory, search by a photo, and book a
            test drive.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <MagneticLink
              href="/cars"
              className="h-12 cursor-pointer bg-[#ff4d1a] px-8 text-base text-white hover:bg-[#ff4d1a]/90"
            >
              View all cars
            </MagneticLink>
            <MagneticLink
              href="/sign-up"
              variant="outline"
              className="h-12 cursor-pointer border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
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
