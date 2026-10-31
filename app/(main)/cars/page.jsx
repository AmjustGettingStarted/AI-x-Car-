import { getCarFilters } from "@/actions/car-listings";
import { BRAND_NAME } from "@/lib/brand";
import CarFilters from "./_components/car-filters";
import CarListings from "./_components/car-listings";

export const metadata = {
  title: `Cars | ${BRAND_NAME}`,
  description: "Browse verified dealership inventory.",
};

const CarsPage = async () => {
  const filtersData = await getCarFilters();
  return (
    <div className="px-2 py-4 sm:px-4">
      <p className="mb-3 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
        Inventory
      </p>
      <h1 className="mb-8 font-[family-name:var(--font-clash)] text-5xl font-semibold uppercase tracking-tight sm:text-7xl">
        Browse Cars
      </h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full shrink-0 lg:w-80">
          <CarFilters filters={filtersData.data} />
        </div>
        <div className="min-w-0 flex-1">
          <CarListings />
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
