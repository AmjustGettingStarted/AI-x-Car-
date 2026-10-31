"use client";

import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/data";

function FaqItem({ item, index }) {
  const glowRef = useRef(null);

  function onMouseMove(event) {
    const glow = glowRef.current;
    if (!glow) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    glow.style.background = `radial-gradient(420px circle at ${x}px ${y}px, rgba(255,77,26,0.16), transparent 58%)`;
  }

  return (
    <AccordionItem
      value={`item-${index}`}
      className="group relative overflow-hidden border-white/10"
      onMouseMove={onMouseMove}
    >
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[state=open]:opacity-100"
      />
      <AccordionTrigger className="group/row cursor-pointer py-7 text-left text-lg text-white hover:no-underline sm:text-2xl [&_svg]:size-5 [&_svg]:text-white/40">
        <span className="flex min-w-0 items-baseline gap-4 sm:gap-6">
          <span className="font-[family-name:var(--font-label)] text-sm tracking-[0.2em] text-white/30 transition-colors duration-300 group-data-[state=open]/row:text-[#ff4d1a]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 font-[family-name:var(--font-clash)] font-medium tracking-tight">
            {item.question}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="max-w-2xl pb-7 pl-12 text-base leading-relaxed text-white/70 motion-reduce:animate-none sm:pl-16">
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="relative z-30 bg-[#050505] py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
              FAQ
            </p>
            <h2
              id="faq-title"
              className="font-[family-name:var(--font-clash)] text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Questions, answered.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-white/60">
              Booking, photo search, saving a car, and what happens after you
              reserve a drive.
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="border-t border-white/10">
          {faqItems.map((item, index) => (
            <FaqItem key={item.question} item={item} index={index} />
          ))}
        </Accordion>
      </div>
    </section>
  );
}
