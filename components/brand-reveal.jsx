import Image from "next/image";
import Link from "next/link";
import { carMakes } from "@/lib/data";

const STUDIO_BG = "/studio-bg.jpg";

function BrandTile({ make, clone = false }) {
  return (
    <Link
      href={`/cars?make=${encodeURIComponent(make.name)}`}
      data-clone={clone ? "true" : undefined}
      aria-hidden={clone ? "true" : undefined}
      tabIndex={clone ? -1 : 0}
      className="group flex w-40 shrink-0 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-5 backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-[#ff4d1a]/60 hover:shadow-[0_20px_60px_-20px_rgba(255,77,26,0.6)] focus-visible:-translate-y-2 focus-visible:border-[#ff4d1a] focus-visible:outline-none sm:w-48"
    >
      <span className="relative h-14 w-full">
        <Image
          src={make.image}
          alt={make.name}
          fill
          sizes="160px"
          className="object-contain"
        />
      </span>
      <span className="font-[family-name:var(--font-clash)] text-sm font-medium uppercase tracking-[0.2em] text-white/80 transition-colors group-hover:text-white">
        {make.name}
      </span>
    </Link>
  );
}

function MarqueeRow({ makes, direction = "left", duration = "48s" }) {
  return (
    <div className="marquee">
      <div
        className="marquee-track"
        data-direction={direction}
        style={{ "--marquee-duration": duration }}
      >
        {makes.map((make) => (
          <BrandTile key={make.id} make={make} />
        ))}
        {makes.map((make) => (
          <BrandTile key={`clone-${make.id}`} make={make} clone />
        ))}
      </div>
    </div>
  );
}

/**
 * Reveal window. The section clips its own box; the fixed image inside never
 * moves, so the neighbouring sections appear to slide across it.
 * No ancestor may carry transform, filter, perspective, will-change or contain.
 */
export default function BrandReveal() {
  const half = Math.ceil(carMakes.length / 2);
  const rowOne = carMakes.slice(0, half);
  const rowTwo = carMakes.slice(half);

  return (
    <section
      aria-labelledby="browse-by-make"
      className="relative z-0 min-h-[100svh] py-24 [clip-path:inset(0)]"
    >
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <Image
          src={STUDIO_BG}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100svh-12rem)] flex-col justify-center gap-12">
        <div className="container mx-auto px-4">
          <p className="mb-3 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
            Verified dealership inventory
          </p>
          <h2
            id="browse-by-make"
            className="font-[family-name:var(--font-clash)] text-4xl font-semibold uppercase tracking-tight text-white sm:text-6xl"
          >
            Browse by Make
          </h2>
          <p className="mt-4 max-w-xl text-sm text-white/60 sm:text-base">
            Pick a marque to filter the showroom.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <MarqueeRow makes={rowOne} direction="left" duration="52s" />
          <MarqueeRow makes={rowTwo} direction="right" duration="60s" />
        </div>
      </div>
    </section>
  );
}
