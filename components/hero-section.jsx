"use client";

import React, { useState, useEffect, useRef } from "react";
import HomeSearch from "@/components/home-search";
import DarkVeil from "@/components/reactbits/dark-veil";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoUnmounted, setVideoUnmounted] = useState(false);
  const videoRef = useRef(null);

  // 1. Session Storage & Preload on mount
  useEffect(() => {
    setIsMounted(true);

    try {
      const alreadyPlayed = sessionStorage.getItem("hero_intro_played") === "true";
      if (alreadyPlayed) {
        setVideoEnded(true);
        setVideoUnmounted(true);
        setHasCheckedSession(true);
        // Dispatch immediately for any listener like Header
        window.dispatchEvent(new CustomEvent("hero-video-ended"));
        return;
      }
    } catch {
      // Fallback if sessionStorage is disabled/blocked
    }

    setHasCheckedSession(true);

    // Preload hero_bg.png during video playback for zero paint lag
    const preloadImg = new window.Image();
    preloadImg.src = "/hero/hero_bg.png";
    if (preloadImg.decode) {
      preloadImg.decode().catch(() => { });
    }
  }, []);

  const finishIntro = () => {
    if (videoEnded) return; // Prevent multiple triggers
    setVideoEnded(true);
    try {
      sessionStorage.setItem("hero_intro_played", "true");
    } catch { }
    window.dispatchEvent(new CustomEvent("hero-video-ended"));

    // Allow 250ms crossfade to complete before unmounting video element
    setTimeout(() => {
      setVideoUnmounted(true);
    }, 250);
  };

  const handleVideoCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If autoplay fails, fail-safe to static image immediately
        finishIntro();
      });
    }
  };

  const handleVideoEnded = () => {
    finishIntro();
  };

  const handleVideoError = () => {
    finishIntro();
  };

  if (!isMounted) {
    return <div className="relative w-full h-screen bg-black" />;
  }

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        {/* 1. Static Image (Preloaded & exact match of video's last frame) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero_bg.png"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Ambient Dark Overlay for contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />


        {/* 2. One-Time Reveal Video */}
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
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-200 ease-out ${videoEnded ? "opacity-0" : "opacity-100"
              }`}
          />
        )}
      </div>

      {/* Skip Button during video playback */}
      {!videoEnded && hasCheckedSession && (
        <button
          onClick={finishIntro}
          className="absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 transition-all duration-200 cursor-pointer animate-fade-in"
        >
          Skip Intro &rarr;
        </button>
      )}

      {/* HERO CONTENT LAYER (Headline, Subtitle, CTA/Search) */}
      <div
        className={`relative z-10 max-w-4xl mx-auto text-center px-4 w-full pt-16 pb-12 transition-all duration-700 ease-out ${videoEnded
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-8 pointer-events-none"
          }`}
      >
        {children ? (
          children
        ) : (
          <>
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-lg animate-pulse">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Next-Gen AI Vehicle Intelligence</span>
            </div>

            {/* Headline */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-sm">
                Find Your Dream Car with AIxCAR
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                Advanced AI Car Search and test drive from thousands of verified vehicles.
              </p>
            </div>

            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-6">
              <HomeSearch />
            </div>

            {/* Quick Action links */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
              <Link
                href="/cars"
                className="inline-flex items-center gap-1 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Browse all inventory <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
