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

function SavedCarsFallback() {
  return (
    <div className="px-2 pb-16">
      <Skeleton className="mb-4 h-4 w-32 bg-white/10" />
      <Skeleton className="mb-8 h-16 w-72 bg-white/10" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-[32rem] rounded-[2rem] bg-white/5" />
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
    <Suspense fallback={<SavedCarsFallback />}>
      <SavedCarsContent />
    </Suspense>
  );
}
