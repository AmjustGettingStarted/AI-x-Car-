import Image from "next/image";
import Link from "next/link";
import { carMakes } from "@/lib/data";

const STUDIO_BG = "/studio-bg.jpg";

function BrandTile({ make, clone = false }) {
  return (
    <Link
      href={`/cars?make=${encodeURIComponent(make.name)}`}
      aria-hidden={clone ? "true" : undefined}
      tabIndex={clone ? -1 : 0}
      className="group flex h-32 w-56 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 backdrop-blur-md transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_40px_-12px_rgba(255,77,26,0.65)] focus-visible:-translate-y-1 focus-visible:bg-white focus-visible:outline-none"
    >
      <span className="relative h-12 w-28">
        <Image
          src={make.image}
          alt={clone ? "" : make.name}
          fill
          sizes="112px"
          className="object-contain opacity-80 brightness-0 invert transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:[filter:none] group-focus-visible:opacity-100 group-focus-visible:[filter:none]"
        />
      </span>
      <span className="font-[family-name:var(--font-label)] text-[11px] uppercase tracking-[0.22em] text-white/70 group-hover:text-black/70 group-focus-visible:text-black/70">
        {make.name}
      </span>
    </Link>
  );
}

function MarqueeRow({ direction = "forward" }) {
  const loop = [...carMakes, ...carMakes];

  return (
    <div className="brand-marquee">
      <div className="brand-marquee-track" data-direction={direction}>
        {loop.map((make, index) => (
          <BrandTile
            key={`${direction}-${make.id}-${index}`}
            make={make}
            clone={index >= carMakes.length}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Window between the featured curtain and the Why Choose curtain.
 * The fixed studio is a direct child of this section. No ancestor may
 * carry transform, filter, perspective, contain, or will-change, and this
 * tree must stay outside motion.* so the photo stays viewport-fixed.
 */
export default function BrandReveal() {
  return (
    <section
      aria-labelledby="browse-by-make"
      className="relative z-10 h-[110vh] [clip-path:inset(0)]"
    >
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <Image
          src={STUDIO_BG}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-center gap-10">
        <div className="container mx-auto px-4">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff4d1a]">
            Shop by brand
          </p>
          <h2
            id="browse-by-make"
            className="font-display text-[clamp(2.5rem,7vw,6rem)] uppercase leading-[0.9] text-white"
          >
            Browse by Make
          </h2>
          <p className="mt-4 text-sm text-white/70">{carMakes.length} makes</p>
        </div>

        <div className="flex flex-col gap-4">
          <MarqueeRow direction="forward" />
          <MarqueeRow direction="reverse" />
        </div>
      </div>
    </section>
  );
}
