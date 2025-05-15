import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";

const CarCard = ({ car }) => {
  return (
    <Card>
      <div className="relative h-40">
        {car.images && car.images.length > 0 ? (
          <div>
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              width={500}
              height={500}
              className="object-cover group-hover:scale-105 transition-all duration-500"
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </Card>
  );
};

export default CarCard;
