import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-[#050505] px-6 text-center text-white">
      <p className="mb-4 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
        {BRAND_NAME}
      </p>
      <h1 className="font-[family-name:var(--font-clash)] text-7xl font-semibold uppercase tracking-tight sm:text-9xl">
        404
      </h1>
      <h2 className="mt-4 font-[family-name:var(--font-clash)] text-2xl uppercase tracking-tight">
        Page not found
      </h2>
      <p className="mt-3 max-w-md text-sm text-white/60">
        This page is not in the showroom. Head back to the inventory.
      </p>
      <Button asChild className="mt-8 bg-[#ff4d1a] text-white hover:bg-[#ff6a3d]">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
