"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

  const showHeader = isMounted && isVisible && scrollDirection === "up";
  const isAdmin = isAdminPage || pathname?.startsWith("/admin");

  const glassStyles = isScrolled
    ? "bg-black/80 backdrop-blur-xl border-b border-orange-500/20 shadow-[0_8px_32px_0_rgba(255,102,0,0.1)] text-white"
    : isAdmin
      ? "bg-white/80 backdrop-blur-md border-b border-slate-200 text-slate-900"
      : "bg-transparent border-transparent text-white";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: showHeader ? 0 : -100,
        opacity: showHeader ? 1 : 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0], // Matches the smooth cubic-bezier curve from hero
      }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${glassStyles} ${className}`}
    >
      {children}
    </motion.header>
  );
}