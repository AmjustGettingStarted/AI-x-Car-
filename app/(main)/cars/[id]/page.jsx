import { getCarById } from "@/actions/car-listings";
import { BRAND_NAME } from "@/lib/brand";
import { notFound } from "next/navigation";
import CarDetails from "./_components/car-details";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result || !result.success || !result.data) {
    return {
      title: `Car Not Found | ${BRAND_NAME}`,
      description: "The requested car could not be found",
    };
  }

  const car = result.data;

  return {
    title: `${car.year} ${car.make} ${car.model} | ${BRAND_NAME}`,
    description: car.description ? car.description.substring(0, 160) : "",
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  };
}
const CarDetailsPage = async ({ params }) => {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result || !result.success || !result.data) {
    notFound();
  }

  return (
    <div className="px-2 py-4 sm:px-4">
      <CarDetails car={result.data} testDriveInfo={result.data.testDriveInfo} />
    </div>
  );
};

export default CarDetailsPage;
