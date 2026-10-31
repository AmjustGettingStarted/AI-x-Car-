"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export default function HeaderWrapper({ children, className = "" }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      setIsScrolled((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = pathname === "/" && !isScrolled;
  const glassStyles = overHero
    ? "border-transparent bg-transparent text-white"
    : "border-b border-white/10 bg-[#0b0b0c]/80 text-white backdrop-blur-xl";

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed top-0 z-50 w-full ${glassStyles} ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      } ${className}`}
    >
      {children}
    </motion.header>
  );
}
