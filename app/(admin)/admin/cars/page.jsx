import React from "react";
import CarsList from "./_components/cars-list";

export const metadata = {
  title: "AI x CAR ✨ADMIN✨",
  description: "We don't pray for love, we just pray for cars.",
};

const CarsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
      <CarsList />
    </div>
  );
};

export default CarsPage;
