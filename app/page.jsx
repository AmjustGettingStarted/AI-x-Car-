import HomeSearch from "@/components/home-search";
import "../app/globals.css";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredCars } from "@/lib/data";
import CarCard from "@/components/car-card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="pt-20 flex flex-col">
      {/* Header */}
      <section className="relative dotted-background py-16 md:py-28 ">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-8xl mb-4 gradient font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-green-500">
              Find Your Dream Car with AIxCAR
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              Advanced AI Car Search and test drive from thousands of vehicles
            </p>
          </div>
          {/* Search */}
          <HomeSearch />
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Cars</h2>
            <Button className="flex items-center" variant="ghost" asChild>
              <Link href="/cars" className=" ">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
