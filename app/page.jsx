import { bodyTypes } from "@/lib/data";
import { getAvailableBodyTypeCounts, getFeaturedCars } from "@/actions/home";
import FeaturedCars from "@/components/featured-cars";
import HeroSection from "@/components/hero-section";
import BrandReveal from "@/components/brand-reveal";
import WhyChoose from "@/components/home/why-choose";
import BodyCoverflow from "@/components/home/body-coverflow";
import FaqSection from "@/components/home/faq-section";
import HomeCta from "@/components/home/home-cta";
import SiteFooter from "@/components/home/site-footer";

function withCounts(counts) {
  const byName = new Map(
    counts.map((row) => [row.bodyType.trim().toLowerCase(), row.count])
  );
  const knownNames = new Set(bodyTypes.map((type) => type.name.toLowerCase()));
  const known = bodyTypes.map((type) => ({
    ...type,
    count: byName.get(type.name.toLowerCase()) ?? 0,
  }));
  const extras = counts
    .filter(
      (row) => row.bodyType && !knownNames.has(row.bodyType.trim().toLowerCase())
    )
    .map((row) => ({
      id: row.bodyType,
      name: row.bodyType,
      image: null,
      count: row.count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [...known, ...extras];
}

export default async function Home() {
  const [featuredCars, bodyTypeCounts] = await Promise.all([
    getFeaturedCars(),
    getAvailableBodyTypeCounts(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Keeps the page above the fixed footer. No transform here: the brand
          reveal image has to stay viewport-fixed. */}
      <div className="relative z-10 flex flex-col bg-[#050505]">
        <HeroSection />

        <section
          aria-labelledby="featured-cars"
          className="relative z-20 rounded-t-[2.5rem] bg-[#050505] shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.9)] sm:rounded-t-[3.5rem]"
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
        <HomeCta />
      </div>

      <div aria-hidden="true" className="pointer-events-none h-[100svh]" />
      <SiteFooter reveal />
    </div>
  );
}
