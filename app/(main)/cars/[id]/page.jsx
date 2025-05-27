import { getCarById } from "@/actions/car-listings";
import React from "react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "❌ Car Not Found ❌ | AIxCAR",
      description: "The requested car could not be found",
    };
  }

  const car = result.data;

  return {
    title: `${car.year} ${car.make} ${car.model} 💕 | AIxCAR`,
    description: car.description.substring(0, 160),
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  };
}
const CarPage = async ({ params }) => {
  const { id } = await params;
  return <div>CarPage : {id}</div>;
};

export default CarPage;
