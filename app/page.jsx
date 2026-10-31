import { getAvailableBodyTypeCounts, getFeaturedCars } from "@/actions/home";
import FeaturedCars from "@/components/featured-cars";
import HeroSection from "@/components/hero-section";
import BrandReveal from "@/components/brand-reveal";
import WhyChoose from "@/components/home/why-choose";
import BodyCoverflow from "@/components/home/body-coverflow";
import FaqSection from "@/components/home/faq-section";
import HomeClose from "@/components/home/home-close";
import Header from "@/components/header";

export const dynamic = "force-dynamic";

const FALLBACK_BODY_TYPES = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Supercar",
  "Pickup",
  "MPV",
];

function withCounts(counts) {
  const source = counts.length
    ? [...counts].sort((a, b) => a.bodyType.localeCompare(b.bodyType))
    : FALLBACK_BODY_TYPES.map((bodyType) => ({ bodyType, count: 0 }));
  const seen = new Set();
  const items = [];

  for (const row of source) {
    const name = row.bodyType?.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ name, count: row.count ?? 0 });
  }

  return items;
}

export default async function Home() {
  const [featuredCars, bodyTypeCounts] = await Promise.all([
    getFeaturedCars(),
    getAvailableBodyTypeCounts(),
  ]);

  return (
    <div className="flex flex-col">
      <Header />
      {/* Keeps the page above the fixed footer. No transform here: the brand
          reveal image has to stay viewport-fixed. */}
      <div className="relative z-10 flex flex-col">
        <HeroSection />

        <section
          aria-labelledby="featured-cars"
          className="relative z-20 rounded-t-[2.5rem] bg-[#050505] shadow-[0_-40px_80px_rgba(0,0,0,0.6)]"
        >
          <h2 id="featured-cars" className="sr-only">
            Featured Cars
          </h2>
          <FeaturedCars featuredCars={featuredCars} />
        </section>

        <BrandReveal />
        <WhyChoose />
        <BodyCoverflow types={withCounts(bodyTypeCounts)} />
        <FaqSection />
        <HomeClose />
      </div>
    </div>
  );
}
