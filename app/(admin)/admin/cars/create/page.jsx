import { BRAND_NAME } from "@/lib/brand";
import AddCarForm from "../_components/add-car-form";

export const metadata = {
  title: `Add a car | ${BRAND_NAME}`,
  description: "Add a car to the dealership inventory.",
};

const AddCarPage = () => {
  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight">
        Add a car
      </h1>
      <AddCarForm />
    </div>
  );
};

export default AddCarPage;
