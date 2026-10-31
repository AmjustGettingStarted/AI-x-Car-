import { getUserTestDrives } from "@/actions/test-drive";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BRAND_NAME } from "@/lib/brand";
import ReservationsList from "./_components/reservations-list";

export const metadata = {
  title: `Reservations | ${BRAND_NAME}`,
  description: "Manage your test drive reservations",
};

const ReservationsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }

  const reservationsResult = await getUserTestDrives();

  return (
    <div className="px-2 py-4 sm:px-4">
      <p className="mb-3 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
        Your drives
      </p>
      <h1 className="mb-8 font-[family-name:var(--font-clash)] text-5xl font-semibold uppercase tracking-tight sm:text-7xl">
        Reservations
      </h1>
      <ReservationsList initialData={reservationsResult} />
    </div>
  );
};

export default ReservationsPage;
