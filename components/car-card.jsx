"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight, Gauge, Heart, Loader2 } from "lucide-react";
import CarImage from "@/components/car-image";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { toggleSavedCar } from "@/actions/car-listings";

function EngineIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 5h6v3H9z" />
      <path d="M5 8h14l2 3v7h-3v2H6v-2H3v-7l2-3z" />
      <circle cx="12" cy="13.5" r="2.5" />
      <path d="M1 11h2M21 11h2M1 15h2M21 15h2" />
    </svg>
  );
}

function TransmissionIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5" cy="6" r="1.75" />
      <circle cx="12" cy="6" r="1.75" />
      <circle cx="19" cy="6" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
      <path d="M5 8v5h14V8" />
      <path d="M12 6v11" />
    </svg>
  );
}

function RoadIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 19L8 5h3L7.5 19H4z" />
      <path d="M20 19L16 5h-3l3.5 14h3.5z" />
      <line x1="12" y1="6" x2="12" y2="9" />
      <line x1="12" y1="12" x2="12" y2="15" />
      <line x1="12" y1="18" x2="12" y2="20" />
    </svg>
  );
}

function getCarSpecs(car) {
  const engine =
    car.engine ||
    (car.fuelType?.toLowerCase().includes("electric")
      ? "ELECTRIC"
      : car.model?.toLowerCase().includes("wraith") || car.make?.toLowerCase().includes("rolls")
      ? "V12"
      : car.model?.toLowerCase().includes("camaro")
      ? "V8"
      : car.bodyType?.toLowerCase().includes("supercar")
      ? "V10"
      : car.bodyType?.toLowerCase().includes("coupe")
      ? "V8"
      : car.bodyType?.toLowerCase().includes("suv")
      ? "V6"
      : "V8");

  const power =
    car.power ||
    (car.model?.toLowerCase().includes("camaro")
      ? "455 HP"
      : car.model?.toLowerCase().includes("wraith")
      ? "624 HP"
      : car.bodyType?.toLowerCase().includes("supercar")
      ? "640 HP"
      : car.bodyType?.toLowerCase().includes("coupe")
      ? "450 HP"
      : car.bodyType?.toLowerCase().includes("suv")
      ? "380 HP"
      : Number(car.price) > 100000
      ? "520 HP"
      : "320 HP");

  const transmission = (car.transmission || "Automatic").toUpperCase();

  const mileage =
    car.mileage !== undefined && car.mileage !== null
      ? `${Number(car.mileage).toLocaleString()} MI`
      : "23 MI";

  return { engine, power, transmission, mileage };
}

function WishlistButton({ car, onSavedChange }) {
  const [isSaved, setIsSaved] = useState(Boolean(car.wishlisted ?? car.wishListed));
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const handled = React.useRef(null);
  const pending = React.useRef(null);
  const toastedError = React.useRef(null);

  const {
    loading: isToggling,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  useEffect(() => {
    if (!toggleResult || handled.current === toggleResult) return;
    handled.current = toggleResult;

    if (!toggleResult.success) {
      if (pending.current !== null) {
        const previous = pending.current;
        pending.current = null;
        setIsSaved(previous);
        onSavedChange?.(previous);
        toast.error(toggleResult.error || "Failed to update favorites");
      }
      return;
    }

    pending.current = null;
    if (toggleResult.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
    }
    onSavedChange?.(toggleResult.saved);
    toast.success(toggleResult.message);
  }, [toggleResult, isSaved, onSavedChange]);

  useEffect(() => {
    if (!toggleError || toastedError.current === toggleError) return;
    toastedError.current = toggleError;
    if (pending.current !== null) {
      const previous = pending.current;
      pending.current = null;
      setIsSaved(previous);
      onSavedChange?.(previous);
    }
    toast.error("Failed to update favorites");
  }, [toggleError, onSavedChange]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (isToggling) return;

    pending.current = isSaved;
    setIsSaved(!isSaved);

    await toggleSavedCarFn(car.id);
  };

  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove from saved cars" : "Save car"}
      onClick={handleToggleSave}
      disabled={isToggling}
      className={`relative z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black/60 ${
        isSaved ? "border-[#ff4d1a]/50 text-[#ff4d1a]" : "text-white"
      }`}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin text-white" />
      ) : (
        <Heart className={isSaved ? "fill-[#ff4d1a]" : ""} size={18} />
      )}
    </button>
  );
}

const CarCard = React.forwardRef(function CarCard(
  {
    car,
    scale,
    opacity,
    skew = true,
    style = {},
    className = "",
    priority = false,
    sizes = "(min-width: 1024px) 80vw, 88vw",
    onSavedChange,
  },
  ref
) {
  const image = car.images?.[0] || car.image;
  const make = car.make?.toUpperCase() || "CHEVROLET";
  const model = car.model?.toUpperCase() || "CAMARO";
  const { engine, power, transmission, mileage } = getCarSpecs(car);
  const skewAngle = skew ? -5.5 : 0;
  const counterSkew = skew ? 5.5 : 0;

  return (
    <motion.article
      ref={ref}
      style={{
        skewX: skewAngle,
        scale,
        opacity,
        ...style,
      }}
      className={`group relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0c0c0e] shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-colors duration-300 hover:border-white/20 md:rounded-[36px] ${className}`}
    >
      {/* Clickable Card Link covering the entire card */}
      <Link
        href={`/cars/${car.id}`}
        aria-label={`View ${car.make} ${car.model}`}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Background Car Image Layer (bleeds past edges to fully fill skewed corners) */}
      <div
        className="absolute -inset-x-14 -inset-y-4 z-0 overflow-hidden"
        style={{ transform: `skewX(${counterSkew}deg)` }}
      >
        <CarImage
          src={image}
          alt={`${car.make} ${car.model}`}
          sizes={sizes}
          priority={priority}
          className="h-full w-full scale-110 object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-115"
        />

        {/* Cinematic lighting gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 to-black/90" />
        <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-black/20 to-black/70 pointer-events-none" />
      </div>

      {/* Inner Content Layer (pointer-events-none so card link works, interactive elements re-enable pointer-events) */}
      <motion.div
        style={{ skewX: counterSkew }}
        className="pointer-events-none relative z-20 flex h-full w-full flex-col justify-between px-8 py-7 sm:px-14 sm:py-8 md:px-16 md:py-9"
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 pr-6">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
              {make}
            </p>

            <div className="relative flex max-w-full items-center overflow-hidden">
              <Link
                href={`/cars/${car.id}`}
                className="pointer-events-auto flex shrink-0 items-center cursor-pointer hover:opacity-90 transition-opacity"
              >
                <h3 className="font-display text-3xl font-black italic uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] sm:text-4xl md:text-5xl">
                  {model}
                </h3>
                <span className="ml-2 font-display text-3xl font-black italic text-[#ff4d1a] drop-shadow-[0_0_12px_rgba(255,77,26,0.6)] sm:text-4xl md:text-5xl select-none">
                  {"//"}
                </span>
              </Link>

              {/* Watermark outline stroked text trailing horizontally */}
              <div
                aria-hidden="true"
                className="pointer-events-none ml-4 hidden shrink-0 select-none font-display text-3xl font-black italic uppercase tracking-tight text-transparent opacity-35 [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] sm:block sm:text-4xl md:text-5xl"
              >
                {model}
              </div>
            </div>
          </div>

          {/* Top-Right Wishlist Button */}
          <div className="pointer-events-auto">
            <WishlistButton car={car} onSavedChange={onSavedChange} />
          </div>
        </div>

        {/* Bottom Specs & Action Bar */}
        <div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Specs row with icons and vertical dividers */}
            <div className="flex flex-wrap items-center gap-y-3">
              {/* Engine Spec */}
              <div className="flex items-center gap-2.5">
                <EngineIcon className="h-5 w-5 shrink-0 text-white/90" />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white tracking-wide">{engine}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/55">
                    Engine
                  </p>
                </div>
              </div>

              <div className="mx-3.5 h-6 w-px bg-white/15 sm:mx-4 md:mx-5" />

              {/* Power Spec */}
              <div className="flex items-center gap-2.5">
                <Gauge className="h-5 w-5 shrink-0 text-white/90" strokeWidth={1.8} />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white tracking-wide">{power}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/55">
                    Power
                  </p>
                </div>
              </div>

              <div className="mx-3.5 h-6 w-px bg-white/15 sm:mx-4 md:mx-5" />

              {/* Transmission Spec */}
              <div className="flex items-center gap-2.5">
                <TransmissionIcon className="h-5 w-5 shrink-0 text-white/90" />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white tracking-wide">{transmission}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/55">
                    Transmission
                  </p>
                </div>
              </div>

              <div className="mx-3.5 h-6 w-px bg-white/15 sm:mx-4 md:mx-5" />

              {/* Mileage Spec */}
              <div className="flex items-center gap-2.5">
                <RoadIcon className="h-5 w-5 shrink-0 text-white/90" />
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white tracking-wide">{mileage}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/55">
                    Mileage
                  </p>
                </div>
              </div>
            </div>

            {/* View car Action Button with racing skewed geometry */}
            <Link
              href={`/cars/${car.id}`}
              className="group/btn pointer-events-auto relative z-30 flex shrink-0 cursor-pointer items-center self-end transition-transform duration-200 active:scale-95 sm:self-auto"
            >
              {/* Slanted dark accent bar */}
              <span
                aria-hidden="true"
                className="mr-2 hidden h-11 w-3.5 -skew-x-[20deg] rounded-[4px] border border-[#ff4d1a]/25 bg-[#ff4d1a]/15 transition-colors group-hover/btn:bg-[#ff4d1a]/30 sm:inline-block"
              />

              {/* Main orange skewed button */}
              <span className="relative flex h-11 items-center justify-center -skew-x-[20deg] rounded-lg bg-[#ff4d1a] px-6 text-white shadow-[0_4px_24px_rgba(255,77,26,0.35)] transition-all duration-300 group-hover/btn:bg-[#ff5a2b] group-hover/btn:shadow-[0_6px_32px_rgba(255,77,26,0.6)]">
                <span className="flex items-center skew-x-[20deg] font-sans text-sm font-bold tracking-wide text-white">
                  View car
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
});

export default CarCard;
