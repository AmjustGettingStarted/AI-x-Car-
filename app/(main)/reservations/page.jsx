import { getUserTestDrives } from "@/actions/test-drive";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import ReservationsList from "./_components/reservations-list";

export const metadata = {
  title: "My Reservations 🗃 | AIxCAR",
  description: "Manage your test drive reservations",
};

const ReservationsPage = async () => {
  // Check user authentication on server
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }

  // Fetch reservations on the server
  const reservationsResult = await getUserTestDrives();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6  gradient font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-green-500">
        Your Reservations
      </h1>
      <ReservationsList initialData={reservationsResult} />
    </div>
  );
};

export default ReservationsPage;
