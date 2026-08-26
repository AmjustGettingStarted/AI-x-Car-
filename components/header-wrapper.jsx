"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HeaderWrapper({ children, className = "" }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only gate visibility on the home page during the first intro
    if (pathname === "/") {
      try {
        const alreadyPlayed = sessionStorage.getItem("hero_intro_played") === "true";
        if (!alreadyPlayed) {
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

  return (
    <header
      className={`fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-3 pointer-events-none"
      } ${className}`}
    >
      {children}
    </header>
  );
}
