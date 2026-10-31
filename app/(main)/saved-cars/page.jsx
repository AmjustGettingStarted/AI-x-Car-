import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getSavedCars } from "@/actions/car-listings";
import { BRAND_NAME } from "@/lib/brand";
import { Skeleton } from "@/components/ui/skeleton";
import SavedCarsList from "./_component/saved-cars-list";

export const metadata = {
  title: `Saved Cars | ${BRAND_NAME}`,
  description: "Cars you saved from the dealership inventory.",
};

const SKELETONS = ["a", "b", "c", "d", "e", "f"];

function SavedCarsFallback() {
  return (
    <div className="pb-16">
      <Skeleton className="mb-3 h-3 w-28 bg-white/10" />
      <Skeleton className="mb-8 h-[clamp(3rem,8vw,7rem)] w-72 max-w-full bg-white/10" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {SKELETONS.map((key) => (
          <div key={key} className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0c]">
            <Skeleton className="aspect-[4/3] w-full rounded-none bg-white/10" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-6 w-3/4 bg-white/10" />
              <Skeleton className="h-5 w-1/3 bg-white/10" />
              <Skeleton className="h-4 w-2/3 bg-white/10" />
              <Skeleton className="h-12 w-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function SavedCarsContent() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
  }

  const savedCarsResult = await getSavedCars();
  return <SavedCarsList initialData={savedCarsResult} />;
}

export default function SavedCarsPage() {
  return (
    <div className="relative bg-[#050505] px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,rgba(255,77,26,0.22),transparent_70%)]"
      />
      <div className="relative">
        <Suspense fallback={<SavedCarsFallback />}>
          <SavedCarsContent />
        </Suspense>
      </div>
    </div>
  );
}
