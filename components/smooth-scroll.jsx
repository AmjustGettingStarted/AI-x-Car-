"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // If navigating to a URL with an anchor hash, let anchor navigation handle it.
    // Otherwise, scroll immediately to top on route change.
    if (!window.location.hash) {
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        anchors: true,
        respectReducedMotion: true,
      }}
    >
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}

export { useLenis };

