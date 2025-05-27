import React from "react";
import SavedCarsList from "./_component/saved-cars-list";
import { getSavedCars } from "@/actions/car-listings";
import { auth } from "@clerk/nextjs/server";
export const metadata = {
  title: " 💝 Saved Cars | AIxCAR",
  description: "View your saed cars and favorites",
};
const SavedCarsPage = async () => {
  // Check authentication on server
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
  }

  // Fetch saved cars on the server
  const savedCarsResult = await getSavedCars();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-green-500">
        Your Saved Cars
      </h1>
      <SavedCarsList initialData={savedCarsResult} />
    </div>
  );
};

export default SavedCarsPage;
