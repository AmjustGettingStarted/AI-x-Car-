"use client";
import React, { useState } from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { CarIcon, Heart } from "lucide-react";
import { Button } from "./ui/button";

const CarCard = ({ car }) => {
  const [isSaved, setIsSaved] = useState(car.wishlisted);
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group">
      <div className="relative h-48">
        {car.images && car.images.length > 0 ? (
          <div className="w-full h-full relative">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-all duration-500"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-white/90 rounded-full p1.5 ${
            isSaved
              ? "text-red-500 hover:text-red-600"
              : "text-gray-600 hover:text-gray-900"
          } `}
        >
          <Heart className={isSaved ? "fill-current" : ""} size={20} />
        </Button>
      </div>
    </Card>
  );
};

export default CarCard;
