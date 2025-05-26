import { getCarFilters } from "@/actions/car-listings";
import React from "react";
import CarFilters from "./_components/car-filters";
import CarListings from "./_components/car-listings";

export const metadata = {
  title: "Cars 🏎 | AIxCAR",
  description: "Browse and search for your dream car",
};

const CarsPage = async () => {
  const filtersData = await getCarFilters();
  return (
    <div className="mx-auto container px-4 py-12">
      <h1 className="text-6xl mb-4 gradient font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-green-500">
        Browse Cars
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex-shrink-0">
          {/* Filters */}
          <CarFilters filters={filtersData.data} />
        </div>
        <div className="flex-1 ">
          {/* Listings */}

          <CarListings />
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
