"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CarDetails = ({ car, testDrive }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);

  return <div>CarDetails</div>;
};

export default CarDetails;
