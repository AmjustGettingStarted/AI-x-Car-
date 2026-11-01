"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const PINNED_THRESHOLD = 80;
const DELTA_THRESHOLD = 10;

export default function HeaderWrapper({ children, className = "" }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    if (pathname !== "/") {
      setIsVisible(true);
      return;
    }

    try {
      if (sessionStorage.getItem("hero_intro_played") === "true") {
        setIsVisible(true);
        return;
      }
    } catch {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    const onEnded = () => setIsVisible(true);
    window.addEventListener("hero-video-ended", onEnded);
    return () => window.removeEventListener("hero-video-ended", onEnded);
  }, [pathname]);

  // Reset scroll state on route changes
  useEffect(() => {
    setIsHidden(false);
    lastScrollY.current = 0;
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      // Glass style threshold
      const nextScrolled = currentScrollY > 24;
      setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled));

      // Always show near top of page
      if (currentScrollY <= PINNED_THRESHOLD) {
        setIsHidden(false);
        lastScrollY.current = Math.max(0, currentScrollY);
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      if (diff > DELTA_THRESHOLD) {
        // Scrolling down -> hide header
        setIsHidden(true);
        lastScrollY.current = currentScrollY;
      } else if (diff < -DELTA_THRESHOLD) {
        // Scrolling up -> show header
        setIsHidden(false);
        lastScrollY.current = currentScrollY;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = pathname === "/" && !isScrolled;
  const glassStyles = overHero
    ? "border-transparent bg-transparent text-white"
    : "border-b border-white/10 bg-[#0b0b0c]/80 text-white backdrop-blur-xl shadow-lg shadow-black/20";

  return (
    <motion.header
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible && isHidden ? "-100%" : "0%",
      }}
      transition={{
        y: {
          duration: shouldReduceMotion ? 0 : 0.35,
          ease: EASE,
        },
        opacity: {
          duration: shouldReduceMotion ? 0 : 0.6,
          ease: EASE,
        },
      }}
      className={`fixed top-0 z-50 w-full ${glassStyles} ${
        isVisible && !isHidden ? "pointer-events-auto" : "pointer-events-none"
      } ${className}`}
      onFocusCapture={() => setIsHidden(false)}
    >
      {children}
    </motion.header>
  );
}
