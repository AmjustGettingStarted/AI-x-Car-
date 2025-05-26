import { Slider } from "@/components/ui/slider";
import React from "react";

const CarFilterControls = ({
  filters,
  currentFilters,
  onFilterChange,
  onClearFilter,
}) => {
  const { make, bodyType, fuelType, transmission, priceRange } = currentFilters;

  const filterSections = [
    {
      id: "make",
      title: "Make",
      options: filters.makes.map((make) => ({ value: make, label: make })),
      currentValue: make,
      onChange: (value) => onFilterChange("make", value),
    },
    {
      id: "bodyType",
      title: "Body Type",
      options: filters.bodyTypes.map((type) => ({ value: type, label: type })),
      currentValue: bodyType,
      onChange: (value) => onFilterChange("bodyType", value),
    },
    {
      id: "fuelType",
      title: "Fuel Type",
      options: filters.fuelTypes.map((type) => ({ value: type, label: type })),
      currentValue: fuelType,
      onChange: (value) => onFilterChange("fuelType", value),
    },
    {
      id: "transmission",
      title: "Transmission",
      options: filters.transmissions.map((type) => ({
        value: type,
        label: type,
      })),
      currentValue: transmission,
      onChange: (value) => onFilterChange("transmission", value),
    },
  ];
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Price Range</h3>
      <div className="px-2">
        <Slider
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          step={100}
          value={priceRange}
          onValueChange={(value) => onFilterChange("priceRange", value)}
        />
      </div>
    </div>
  );
};

export default CarFilterControls;
