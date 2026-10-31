"use client";
import { cancelTestDrive } from "@/actions/test-drive";
import TestDriveCard from "@/components/test-drive-card";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { Calendar } from "lucide-react";
import Link from "next/link";
import React from "react";

const ReservationsList = ({ initialData }) => {
  const {
    loading: cancelling,
    fn: cancelBookingFn,
    error: cancelError,
  } = useFetch(cancelTestDrive);

  // Handle cancellation
  const handleCancelBooking = async (bookingId) => {
    await cancelBookingFn(bookingId);
  };

  // Group bookings by status
  const upcomingBookings = initialData?.data?.filter((booking) =>
    ["PENDING", "CONFIRMED"].includes(booking.status)
  );
  const pastBookings = initialData?.data?.filter((booking) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(booking.status)
  );

  // No reservations
  if (initialData?.data?.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#0b0b0c] p-8 text-center">
        <div className="mb-4 rounded-full border border-[#ff4d1a]/30 bg-[#ff4d1a]/10 p-4">
          <Calendar className="h-8 w-8 text-[#ff4d1a]" />
        </div>
        <h3 className="font-[family-name:var(--font-clash)] text-2xl font-semibold uppercase tracking-tight">
          No reservations yet
        </h3>
        <p className="mb-6 mt-3 max-w-md text-sm text-white/60">
          You have no test drive reservations yet. Browse the inventory and book
          a drive.
        </p>
        <Button variant="default" asChild className={`cursor-pointer`}>
          <Link href="/cars">Browse Cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div>
        <h2 className="mb-4 font-[family-name:var(--font-clash)] text-2xl font-semibold uppercase tracking-tight">
          Upcoming Test Drives
        </h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-sm text-white/50">No upcoming test drives.</p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <TestDriveCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                isCancelling={cancelling}
                showActions
                cancelError={cancelError}
                viewMode="list"
              />
            ))}
          </div>
        )}
      </div>
      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="mb-4 font-[family-name:var(--font-clash)] text-2xl font-semibold uppercase tracking-tight">
            Past Test Drives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastBookings.map((booking) => (
              <TestDriveCard
                key={booking.id}
                booking={booking}
                showActions={false}
                isPast
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsList;
