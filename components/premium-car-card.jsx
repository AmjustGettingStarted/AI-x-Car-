"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CarIcon, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { toggleSavedCar } from "@/actions/car-listings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function WishlistButton({ car, onSavedChange }) {
  const [isSaved, setIsSaved] = useState(Boolean(car.wishlisted));
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const {
    loading: isToggling,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  useEffect(() => {
    if (toggleResult?.success && toggleResult.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
      toast.success(toggleResult.message);
      onSavedChange?.(toggleResult.saved);
    }
  }, [toggleResult, isSaved, onSavedChange]);

  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (isToggling) return;
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
      className={`h-10 w-10 cursor-pointer rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-colors hover:bg-black/60 ${
        isSaved ? "text-[#ff4d1a] hover:text-[#ff6a3d]" : "text-white/80 hover:text-white"
      }`}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={isSaved ? "fill-current" : ""} size={18} />
      )}
    </Button>
  );
}

const PremiumCarCard = React.forwardRef(function PremiumCarCard(
  {
    car,
    imageX,
    scale,
    opacity,
    className = "",
    priority = false,
    tilt = false,
    onSavedChange,
    sizes = "(min-width: 1024px) 80vw, 88vw",
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

  return (
    <motion.article
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        scale,
        opacity,
        rotateX: tilt ? springX : 0,
        rotateY: tilt ? springY : 0,
      }}
      className={`group relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0c] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ${className}`}
    >
      <Link
        href={`/cars/${car.id}`}
        aria-label={`View ${car.make} ${car.model}`}
        className="absolute inset-0 z-0"
      >
        {image ? (
          <motion.div
            style={{ x: imageX }}
            className="absolute inset-[-8%] will-change-transform"
          >
            <Image
              src={image}
              alt={`${car.make} ${car.model}`}
              fill
              priority={priority}
              sizes={sizes}
              className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
          </motion.div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#111113]">
            <CarIcon className="h-16 w-16 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
      </Link>

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <WishlistButton car={car} onSavedChange={onSavedChange} />
      </div>

      <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-5 sm:bottom-5">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/45 p-4 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate font-[family-name:var(--font-clash)] text-2xl font-semibold uppercase tracking-tight text-white sm:text-4xl">
                {car.make} {car.model}
              </h3>
              <p className="mt-1 text-xl font-semibold text-[#1a5cff] sm:text-2xl">
                ${Number(car.price).toLocaleString()}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60 sm:text-sm">
                {car.year}
                <span className="mx-2 text-white/30">/</span>
                {car.transmission}
                <span className="mx-2 text-white/30">/</span>
                {car.fuelType}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white/80"
                >
                  {car.bodyType}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white/80"
                >
                  {Number(car.mileage).toLocaleString()} miles
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white/80"
                >
                  {car.color}
                </Badge>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="shrink-0 cursor-pointer rounded-full bg-[#ff4d1a] px-7 text-white shadow-[0_0_30px_rgba(255,77,26,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[#ff6a3d]"
            >
              <Link href={`/cars/${car.id}`}>View Car</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export default PremiumCarCard;
