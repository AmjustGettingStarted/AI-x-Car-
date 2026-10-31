"use client";

import React, { useState, useEffect, useRef } from "react";
import HomeSearch from "@/components/home-search";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Container variant to handle staggered children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each child component animating in
      delayChildren: 0.1,  // Small initial pause after video ends
    },
  },
};

// Item variant for slow, smooth upward fade-in
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0], // Custom smooth cubic-bezier curve
    },
  },
};

export default function HeroSection({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoUnmounted, setVideoUnmounted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);

    try {
      const alreadyPlayed = sessionStorage.getItem("hero_intro_played") === "true";
      if (alreadyPlayed) {
        setVideoEnded(true);
        setVideoUnmounted(true);
        setHasCheckedSession(true);
        window.dispatchEvent(new CustomEvent("hero-video-ended"));
        return;
      }
    } catch { }

    setHasCheckedSession(true);

    const preloadImg = new window.Image();
    preloadImg.src = "/hero/hero_bg.png";
    if (preloadImg.decode) {
      preloadImg.decode().catch(() => { });
    }
  }, []);

  const finishIntro = () => {
    if (videoEnded) return;
    setVideoEnded(true);
    try {
      sessionStorage.setItem("hero_intro_played", "true");
    } catch { }
    window.dispatchEvent(new CustomEvent("hero-video-ended"));

    setTimeout(() => {
      setVideoUnmounted(true);
    }, 250);
  };

  const handleVideoCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        finishIntro();
      });
    }
  };

  if (!isMounted) {
    return <div className="relative w-full h-screen bg-black" />;
  }

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end items-center overflow-hidden pb-10 sm:pb-14">
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        {/* Static Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero_bg.png"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 pointer-events-none" />

        {/* One-Time Reveal Video */}
        {!videoUnmounted && (
          <video
            ref={videoRef}
            src="/hero/car_reveal.mp4"
            autoPlay
            muted
            playsInline
            controls={false}
            loop={false}
            preload="auto"
            onCanPlay={handleVideoCanPlay}
            onEnded={finishIntro}
            onError={finishIntro}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ease-out ${videoEnded ? "opacity-0" : "opacity-100"
              }`}
          />
        )}
      </div>

      {/* Skip Intro Button */}
      {!videoEnded && hasCheckedSession && (
        <button
          onClick={finishIntro}
          className="absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white bg-black/50 hover:bg-black/80 backdrop-blur-md border border-[#FF5F1F]/30 transition-all duration-200 cursor-pointer"
        >
          Skip Intro &rarr;
        </button>
      )}

      {/* HERO CONTENT LAYER WITH MOTION STAGGER */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={videoEnded ? "visible" : "hidden"}
        className="relative z-10 max-w-6xl mx-auto text-center px-4 w-full"
      >
        {children ? (
          children
        ) : (
          <>
            {/* Title Header */}
            <motion.h1
              variants={itemVariants}
              className="relative flex flex-col items-center justify-center font-[family-name:var(--font-trento)] text-white uppercase font-normal tracking-normal text-center select-none mb-16 gap-4"
            >
              <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] block -translate-y-[10px] sm:-translate-y-[14px]">
                WHERE LUXURY MEETS
              </span>
              <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] block translate-y-[10px] sm:translate-y-[14px]">
                PERFORMANCE
              </span>
            </motion.h1>

            {/* Search Bar Container */}
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-6">
              <HomeSearch />
            </motion.div>

            {/* Subtext Link */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-50/50"
            >
              <Link
                href="/cars"
                className="inline-flex items-center gap-1.5 hover:text-[#FF5F1F] transition-colors duration-200 underline-offset-4 hover:underline font-medium uppercase tracking-widest text-xs"
              >
                Browse full inventory <MoveRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </>
        )}
      </motion.div>
    </section>
  );
}