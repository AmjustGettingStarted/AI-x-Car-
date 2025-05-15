import HomeSearch from "@/components/home-search";
import "../app/globals.css";
import { Calendar, Car, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { carMakes, featuredCars } from "@/lib/data";
import CarCard from "@/components/car-card";
import Link from "next/link";
import Image from "next/image";

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

      {/* Featured */}
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

      {/* Browse Brands */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Browse by Make</h2>
            <Button className="flex items-center" variant="ghost" asChild>
              <Link href="/cars" className=" ">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {carMakes.map((make) => {
              return (
                <Link
                  href={`/cars?make=${make.name}`}
                  key={make.name}
                  className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition"
                >
                  <div className="h-16 w-auto mx-auto mb-2 relative">
                    <Image
                      src={make.image}
                      fill
                      alt={make.image}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-medium">{make.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div>
          <h2 className="text-2xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of verified vehicles from trusted dealerships and
                private sellers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Test Drive</h3>
              <p className="text-gray-600">
                Book a test drive online in minutes, with flexible schedulin{" "}
                options.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Process</h3>
              <p className="text-gray-600">
                Verified listings and secure booking process for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
