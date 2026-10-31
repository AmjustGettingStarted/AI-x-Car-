"use client";

import { useLayoutEffect, useRef, useState } from "react";
import HomeCta from "@/components/home/home-cta";
import SiteFooter from "@/components/home/site-footer";

/**
 * The footer is viewport-fixed inside this clip window. No ancestor may use
 * transform, filter, perspective, contain, or will-change, or the footer
 * will scroll with the page instead of sitting still under the CTA.
 */
export default function HomeClose() {
  const footerRef = useRef(null);
  const [height, setHeight] = useState(640);

  useLayoutEffect(() => {
    const node = footerRef.current;
    if (!node) return undefined;
    const measure = () => setHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pointer-events-none relative z-30 [clip-path:inset(0)]">
      <SiteFooter reveal ref={footerRef} />
      <HomeCta />
      <div aria-hidden="true" className="pointer-events-none" style={{ height }} />
    </div>
  );
}
