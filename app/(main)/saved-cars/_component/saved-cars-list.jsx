"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const SORTS = [
  { value: "recent", label: "Recently saved" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
  { value: "year", label: "Newest year" },
];

export default function SavedCarsList({ initialData }) {
  const source = useMemo(
    () => (initialData?.success ? initialData.data || [] : []),
    [initialData]
  );
  const savedOrder = useMemo(
    () => new Map(source.map((car, index) => [car.id, index])),
    [source]
  );
  const [cars, setCars] = useState(source);
  const [sort, setSort] = useState("recent");
  const [bodyType, setBodyType] = useState("all");
  const removed = useRef(new Map());
  const reduce = useReducedMotion();

  const bodyTypes = useMemo(() => {
    return [...new Set(cars.map((car) => car.bodyType).filter(Boolean))].sort();
  }, [cars]);

  const activeBody = bodyType !== "all" && bodyTypes.includes(bodyType) ? bodyType : "all";

  const visible = useMemo(() => {
    const rank = (car) => savedOrder.get(car.id) ?? 0;
    const filtered = activeBody === "all" ? cars : cars.filter((car) => car.bodyType === activeBody);
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price || rank(a) - rank(b);
      if (sort === "price-desc") return b.price - a.price || rank(a) - rank(b);
      if (sort === "year") return b.year - a.year || rank(a) - rank(b);
      return rank(a) - rank(b);
    });
  }, [activeBody, cars, savedOrder, sort]);

  const onSavedChange = useCallback((carId, saved) => {
    if (!saved) {
      setCars((current) => {
        const car = current.find((item) => item.id === carId);
        if (car) removed.current.set(carId, car);
        return current.filter((item) => item.id !== carId);
      });
      return;
    }

    setCars((current) => {
      if (current.some((item) => item.id === carId)) return current;
      const car = removed.current.get(carId);
      if (!car) return current;
      removed.current.delete(carId);
      return [car, ...current];
    });
  }, []);

  if (!initialData?.success) {
    return (
      <div className="pb-16">
        <p className="font-display text-2xl uppercase text-white">Saved cars unavailable</p>
        <p className="mt-3 text-sm text-white/70">{initialData?.error || "Failed to load saved cars."}</p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff4d1a]">Your garage</p>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="max-w-full font-display text-[clamp(3rem,8vw,7rem)] font-semibold uppercase leading-[0.85] text-white">
          Saved Cars
          <sup className="ml-3 align-super text-[0.28em] font-semibold tracking-normal text-[#ff4d1a]">
            {cars.length}
          </sup>
        </h1>
        <div className="flex min-w-0 flex-col gap-3 sm:items-end">
          <Tabs value={activeBody} onValueChange={setBodyType} className="max-w-full">
            <TabsList className="h-auto max-w-full justify-start overflow-x-auto bg-[#111113]">
              <TabsTrigger
                value="all"
                className="cursor-pointer text-white/70 data-[state=active]:bg-[#0b0b0c] data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              {bodyTypes.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="cursor-pointer text-white/70 data-[state=active]:bg-[#0b0b0c] data-[state=active]:text-white"
                >
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              className="w-full cursor-pointer border-white/20 bg-[#0b0b0c] text-white sm:w-56"
              aria-label="Sort saved cars"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
          <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.9] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.75)]">
            Nothing saved yet
          </h2>
          <p className="mt-4 max-w-md text-base text-white/70">
            Browse the dealership inventory and tap the heart on a car. It stays here until you book a drive or let it go.
          </p>
          <Button asChild className="mt-8 h-12 bg-[#ff4d1a] px-6 text-white hover:bg-[#ff6a3d]">
            <Link href="/cars">Browse cars</Link>
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-sm text-white/70">No saved cars match that body type.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((car, index) => (
              <motion.div
                key={car.id}
                layout={!reduce}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="min-w-0"
              >
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : index * 0.05, ease: EASE }}
                >
                  <PremiumCarCard
                    car={{ ...car, wishlisted: true }}
                    layout="stack"
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                    onSavedChange={(saved) => onSavedChange(car.id, saved)}
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
