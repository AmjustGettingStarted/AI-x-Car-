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
      <AccordionTrigger className="group/row cursor-pointer py-[28px] text-left text-[clamp(1.5rem,2.2vw,1.875rem)] leading-tight text-white hover:no-underline [&_svg]:size-5 [&_svg]:text-white/50">
        <span className="flex min-w-0 items-baseline gap-4 sm:gap-6">
          <span className="font-[family-name:var(--font-label)] text-sm tracking-[0.2em] text-white/40 transition-colors duration-300 group-data-[state=open]/row:text-[#ff4d1a]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 font-display font-medium tracking-tight">
            {item.question}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="max-w-2xl pb-[28px] pl-12 text-[17px] leading-relaxed text-white/75 motion-reduce:animate-none sm:pl-16">
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative z-20 rounded-b-[2.5rem] border-b border-white/10 bg-[#050505] shadow-[0_40px_90px_rgba(255,77,26,0.22)]"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-40 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <div className="lg:sticky lg:top-32">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#ff4d1a]">
              FAQ
            </p>
            <h2
              id="faq-title"
              className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-white"
            >
              Questions, answered.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-white/70">
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
