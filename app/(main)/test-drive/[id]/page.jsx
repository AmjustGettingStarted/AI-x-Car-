import { getCarById } from "@/actions/car-listings";
import { BRAND_NAME } from "@/lib/brand";
import { notFound } from "next/navigation";
import TestDriveForm from "./_component/test-drive-form";

export async function generateMetadata() {
  return {
    title: `Book Test Drive | ${BRAND_NAME}`,
    description: "Schedule a test drive in a few seconds",
  };
}

const TestDrivePage = async ({ params }) => {
  // Fetch car details
  const { id } = await params;
  const result = await getCarById(id);

  // If car not found, show 404
  if (!result.success) {
    notFound();
  }
  return (
    <div className="px-2 py-4 sm:px-4">
      <p className="mb-3 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
        Booking
      </p>
      <h1 className="mb-8 font-[family-name:var(--font-clash)] text-5xl font-semibold uppercase tracking-tight sm:text-7xl">
        Book a Test Drive
      </h1>
      <TestDriveForm
        car={result.data}
        testDriveInfo={result.data.testDriveInfo}
      />
    </div>
  );
};

export default TestDrivePage;
