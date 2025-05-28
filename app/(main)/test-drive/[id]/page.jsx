import { getCarById } from "@/actions/car-listings";
import React from "react";

export async function generateMetadata() {
  return {
    title: `Book Test Drive 📑 | AIxCAR`,
    description: `Schedule a test drive in few seconds`,
  };
}

const TestDrivePage = async ({ params }) => {
  // Fetch car details
  const { id } = params;
  const result = await getCarById(id);

  // If car not found, show 404
  if (!result.success) {
    notFound();
  }
  return <div>TestDrivePage: {id}</div>;
};

export default TestDrivePage;
