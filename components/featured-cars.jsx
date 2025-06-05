"use client";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarCard from "./car-card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const FeaturedCars = ({ featuredCars }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  return (
    <>
      {/* Featured Section in Carousel */}
      <div className="hidden lg:block ">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          // onMouseEnter={plugin.current.stop}
          // onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="space-x-4">
            {featuredCars.map((car, i) => (
              <CarouselItem className="max-w-sm " key={i}>
                <CarCard key={car.id} car={car} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Featured Section In GRID */}
      {/* <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-2 lg:gap-6 ">
                  {featuredCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div> */}

      {/* Featured Section on Mobile View */}
      <div className="flex lg:hidden w-full ">
        <ScrollArea
          className="w-full whitespace-nowrap rounded-md "
          plugins={[plugin.current]}
        >
          <div className="flex w-max space-x-4 p-4">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>
    </>
  );
};

export default FeaturedCars;
