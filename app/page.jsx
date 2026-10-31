import * as React from "react";
import { Calendar, Car, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bodyTypes, faqItems } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SignedOut } from "@clerk/nextjs";
import { getFeaturedCars } from "@/actions/home";
import FeaturedCars from "@/components/featured-cars";
import HeroSection from "@/components/hero-section";
import BrandReveal from "@/components/brand-reveal";

const whyChooseUs = [
  {
    icon: Car,
    title: "Wide Selection",
    copy: "Thousands of verified vehicles from our dealership inventory, inspected before they are listed.",
  },
  {
    icon: Calendar,
    title: "Easy Test Drive",
    copy: "Book a test drive online in minutes, with flexible scheduling options.",
  },
  {
    icon: Shield,
    title: "Secure Process",
    copy: "Verified listings and a secure booking process for peace of mind.",
  },
];

export default async function Home() {
  const featuredCars = await getFeaturedCars();

  return (
    <div className="flex flex-col">
      {/* Layer 0: pinned hero. The next section slides over it. */}
      <HeroSection />

      {/* Layer 1: upper curtain. Must stay transform-free so the reveal below works. */}
      <section
        aria-labelledby="featured-cars"
        className="relative z-20 rounded-t-[2.5rem] bg-[#050505] shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.9)] sm:rounded-t-[3.5rem]"
      >
        <h2 id="featured-cars" className="sr-only">
          Featured Cars
        </h2>
        <FeaturedCars featuredCars={featuredCars} />
      </section>

      {/* Layer 2: reveal window over the fixed studio image. */}
      <BrandReveal />

      {/* Layer 3: lower curtain. */}
      <section className="relative z-20 bg-[#050505] py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <p className="mb-3 text-center font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
            Why Ignite
          </p>
          <h2 className="mb-14 text-center font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight text-white sm:text-5xl">
            Why Choose Our Platform
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {whyChooseUs.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-[#0b0b0c] p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#ff4d1a]/30 bg-[#ff4d1a]/10 text-[#ff4d1a]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Body Type */}
      <section className="relative z-20 bg-[#050505] py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Browse by Body Type</h2>
            <Button
              className="flex items-center text-white/70 hover:text-white"
              variant="ghost"
              asChild
            >
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {bodyTypes.map((type) => {
              return (
                <Link
                  href={`/cars?bodyType=${type.name}`}
                  key={type.name}
                  className="group relative cursor-pointer"
                >
                  <div className="relative mb-4 flex h-36 justify-end overflow-hidden rounded-lg">
                    <Image
                      src={type.image}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      alt={type.name}
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end rounded-lg bg-black/30">
                    <h3 className="pb-2 pl-4 text-xl font-bold tracking-wide text-white">
                      {type.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-20 bg-[#050505] py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => {
              return (
                <AccordionItem value={`item-${i}`} key={i}>
                  <AccordionTrigger className="cursor-pointer hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer} </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Second Hero */}
      <section className="relative z-20 bg-[#050505] py-16 text-white">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold capitalize">
            Ready to find your Dream car?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/60">
            Join thousands of satisfied customers who found their perfect
            vehicle through our platform
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild variant="secondary">
              <Link href="/cars">View All Cars</Link>
            </Button>

            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">Sign Up Now</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}
