import React from "react";
import TestDriveList from "./_components/test-drive-list";

export const metadata = {
  title: "Test Drives 🍷 | AIxCAR Admin",
  description: "Manage test drive bookings",
};

const TestDrives = () => {
  return (
    <div className="py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Test Drive Management</h1>
      <TestDriveList />
    </div>
  );
};

export default TestDrives;
