import { BRAND_NAME } from "@/lib/brand";
import CarsList from "./_components/cars-list";

export const metadata = {
  title: `Cars | ${BRAND_NAME}`,
  description: "Manage dealership inventory.",
};

const CarsPage = () => {
  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight">
        Cars
      </h1>
      <CarsList />
    </div>
  );
};

export default CarsPage;
