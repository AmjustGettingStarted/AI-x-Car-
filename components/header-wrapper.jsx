"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HeaderWrapper({ children, className = "" }) {
  const pathname = usePathname();

  // Default to hidden before hydration to prevent the flash issue
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (pathname === "/") {
      try {
        const alreadyPlayed = sessionStorage.getItem("hero_intro_played") === "true";
        if (alreadyPlayed) {
          setIsVisible(true);
        } else {
          // Keep hidden, wait for custom event
          setIsVisible(false);
          const onEnded = () => setIsVisible(true);
          window.addEventListener("hero-video-ended", onEnded);
          return () => {
            window.removeEventListener("hero-video-ended", onEnded);
          };
        }
      } catch {
        // Fallback
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, [pathname]);

  const showHeader = isMounted && isVisible;

  return (
    <header
      className={`fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md transition-all duration-500 ease-out ${showHeader
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-3 pointer-events-none"
        } ${className}`}
    >
      {children}
    </header>
  );
}
