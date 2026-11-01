"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import CarImage from "@/components/car-image";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { toggleSavedCar } from "@/actions/car-listings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CarCard from "@/components/car-card";

function WishlistButton({ car, onSavedChange, optimistic = false }) {
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
      if (optimistic && pending.current !== null) {
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
  }, [toggleResult, isSaved, onSavedChange, optimistic]);

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

    if (optimistic) {
      pending.current = isSaved;
      setIsSaved(!isSaved);
    }

    await toggleSavedCarFn(car.id);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from saved cars" : "Save car"}
      onClick={handleToggleSave}
      className={`h-11 w-11 cursor-pointer rounded-full border border-white/15 bg-black/60 hover:bg-black/80 ${
        isSaved ? "text-[#ff4d1a] hover:text-[#ff6a3d]" : "text-white hover:text-white"
      }`}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={isSaved ? "fill-[#ff4d1a]" : ""} size={18} />
      )}
    </Button>
  );
}

const PremiumCarCard = React.forwardRef(function PremiumCarCard(
  {
    car,
    scale,
    opacity,
    className = "",
    priority = false,
    tilt = false,
    onSavedChange,
    sizes = "(min-width: 1024px) 80vw, 88vw",
    layout = "overlay",
  },
  ref
) {
  const image = car.images?.[0];
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 24, mass: 0.4 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 24, mass: 0.4 });

  function onPointerMove(event) {
    if (!tilt) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(py * -8);
  }

  function onPointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const chips = [
    car.bodyType,
    Number.isFinite(Number(car.mileage)) ? `${Number(car.mileage).toLocaleString()} miles` : null,
    car.color,
  ].filter(Boolean);

  if (layout === "stack") {
    return (
      <article
        ref={ref}
        className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0c] transition-[transform,border-color] duration-300 hover:border-[#ff4d1a] motion-safe:hover:-translate-y-1 ${className}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link
            href={`/cars/${car.id}`}
            aria-label={`View ${car.make} ${car.model}`}
            className="absolute inset-0 z-0"
          >
            <CarImage
              src={image}
              alt={`${car.make} ${car.model}`}
              sizes={sizes}
              priority={priority}
              foregroundClassName="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.04]"
            />
          </Link>
          <div className="absolute right-4 top-4 z-10">
            <WishlistButton car={car} onSavedChange={onSavedChange} optimistic />
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-[#0b0b0c] p-5">
          <h3 className="line-clamp-2 text-balance font-display text-xl font-semibold uppercase leading-tight text-white">
            {car.make} {car.model}
          </h3>
          <p className="mt-2 text-lg font-semibold leading-none text-[#1a5cff]">
            ${Number(car.price).toLocaleString()}
          </p>
          <p className="mt-3 text-sm text-white/70">
            {car.year}
            <span className="mx-2 text-white/40">/</span>
            {car.transmission}
            <span className="mx-2 text-white/40">/</span>
            {car.fuelType}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((label, index) => (
              <Badge key={`${label}-${index}`} className="border-transparent bg-white/10 text-white">
                {label}
              </Badge>
            ))}
          </div>
          <Button
            asChild
            className="mt-5 h-12 w-full cursor-pointer bg-[#ff4d1a] text-white hover:bg-[#ff6a3d]"
          >
            <Link href={`/cars/${car.id}`}>
              View car <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </article>
    );
  }

  return (
    <CarCard
      ref={ref}
      car={car}
      scale={scale}
      opacity={opacity}
      className={className}
      priority={priority}
      sizes={sizes}
      onSavedChange={onSavedChange}
    />
  );
});

export default PremiumCarCard;
