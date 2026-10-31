import { BRAND_NAME } from "@/lib/brand";
import TestDriveList from "./_components/test-drive-list";

export const metadata = {
  title: `Test Drives | ${BRAND_NAME}`,
  description: "Manage test drive bookings",
};

const TestDrives = () => {
  return (
    <div className="px-4 py-6 md:px-6">
      <h1 className="mb-6 font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight">
        Test drives
      </h1>
      <TestDriveList />
    </div>
  );
};

export default TestDrives;
