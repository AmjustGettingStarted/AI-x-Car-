"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import PremiumCarCard from "@/components/premium-car-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EASE = [0.22, 1, 0.36, 1];

export default function SavedCarsList({ initialData }) {
  const source = initialData?.success ? initialData.data || [] : [];
  const savedOrder = useMemo(
    () => new Map(source.map((car, index) => [car.id, index])),
    [source]
  );
  const [cars, setCars] = useState(source);
  const [sort, setSort] = useState("newest");
  const [bodyType, setBodyType] = useState("all");

  const bodyTypes = useMemo(() => {
    return [...new Set(cars.map((car) => car.bodyType).filter(Boolean))].sort();
  }, [cars]);

  const visible = useMemo(() => {
    const filtered =
      bodyType === "all"
        ? cars
        : cars.filter((car) => car.bodyType === bodyType);
    return [...filtered].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "body") return a.bodyType.localeCompare(b.bodyType);
      return (savedOrder.get(a.id) ?? 0) - (savedOrder.get(b.id) ?? 0);
    });
  }, [bodyType, cars, savedOrder, sort]);

  const onSavedChange = useCallback((carId, saved) => {
    if (!saved) {
      setCars((current) => current.filter((car) => car.id !== carId));
    }
  }, []);

  return (
    <div className="px-2 pb-16">
      <p className="mb-3 font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
        Your garage
      </p>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-[#ff4d1a] to-[#fff1ea] bg-clip-text font-[family-name:var(--font-clash)] text-5xl font-semibold uppercase tracking-tight text-transparent sm:text-7xl">
            Saved Cars
          </h1>
          <p className="mt-3 text-sm text-white/60">
            {cars.length} saved {cars.length === 1 ? "car" : "cars"}
            {bodyType !== "all" ? ` · showing ${visible.length}` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Tabs value={sort} onValueChange={setSort}>
            <TabsList className="bg-[#111113]">
              <TabsTrigger value="newest" className="cursor-pointer">
                Newest
              </TabsTrigger>
              <TabsTrigger value="price" className="cursor-pointer">
                Price
              </TabsTrigger>
              <TabsTrigger value="body" className="cursor-pointer">
                Body type
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={bodyType} onValueChange={setBodyType}>
            <SelectTrigger className="w-full cursor-pointer sm:w-44">
              <SelectValue placeholder="Body type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All body types</SelectItem>
              {bodyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#0b0b0c] px-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#ff4d1a]/30 bg-[#ff4d1a]/10 text-[#ff4d1a]">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="font-[family-name:var(--font-clash)] text-3xl font-semibold uppercase tracking-tight">
            Nothing saved yet
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
            Browse the dealership inventory and tap the heart on a car. It will
            stay here until you book a drive or let it go.
          </p>
          <Button asChild className="mt-8 bg-[#ff4d1a] text-white hover:bg-[#ff6a3d]">
            <Link href="/cars">Browse cars</Link>
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-sm text-white/60">No saved cars match that body type.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((car, index) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, y: 72 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }}
                className="h-[32rem]"
                style={{ perspective: 900 }}
              >
                <PremiumCarCard
                  car={{ ...car, wishlisted: true }}
                  tilt
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                  onSavedChange={(saved) => onSavedChange(car.id, saved)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
