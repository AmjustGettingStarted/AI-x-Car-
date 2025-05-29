import { getUserTestDrives } from "@/actions/test-drive";
import { auth } from "@clerk/nextjs/server";
import React from "react";

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

  return <div>ReservationsPage</div>;
};

export default ReservationsPage;
