"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function HeaderWrapper({ children, className = "", isAdminPage = false }) {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");

  const lastScrollY = useRef(0);

  useEffect(() => {
    setIsMounted(true);

    if (pathname === "/") {
      try {
        const alreadyPlayed =
          sessionStorage.getItem("hero_intro_played") === "true";
        if (alreadyPlayed) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          const onEnded = () => setIsVisible(true);
          window.addEventListener("hero-video-ended", onEnded);
          return () => {
            window.removeEventListener("hero-video-ended", onEnded);
          };
        }
      } catch {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection("up");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showHeader = isMounted && isVisible;
  const isHeaderHiddenOnScroll = isScrolled && scrollDirection === "down";
  const isAdmin = isAdminPage || pathname?.startsWith("/admin");

  const glassStyles = isScrolled
    ? "bg-black/80 backdrop-blur-xl border-b border-orange-500/20 shadow-[0_8px_32px_0_rgba(255,102,0,0.1)] text-white"
    : isAdmin
      ? "bg-white/80 backdrop-blur-md border-b border-slate-200 text-slate-900"
      : "bg-transparent border-transparent text-white";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${glassStyles} ${showHeader && !isHeaderHiddenOnScroll
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-full pointer-events-none"
        } ${className}`}
    >
      {children}
    </header>
  );
}