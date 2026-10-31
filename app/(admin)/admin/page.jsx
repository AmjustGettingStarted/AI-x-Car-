import { getAdminAnalytics, getAdminDriveSeries, getDashboardData } from "@/actions/admin";
import { BRAND_NAME } from "@/lib/brand";
import { Dashboard } from "./_components/dashboard";

export const metadata = {
  title: `Dashboard | ${BRAND_NAME}`,
  description: "Dealership dashboard for inventory, bookings, and sales.",
};

export const dynamic = "force-dynamic";

const AdminPage = async () => {
  const [dashboardData, analytics, drives] = await Promise.all([
    getDashboardData(),
    getAdminAnalytics(),
    getAdminDriveSeries(),
  ]);

  return (
    <div className="p-4 md:p-6">
      <p className="mb-2 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
        Overview
      </p>
      <h1 className="mb-6 font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
        Dashboard
      </h1>
      <Dashboard initialData={dashboardData} analytics={analytics} drives={drives} />
    </div>
  );
};

export default AdminPage;
