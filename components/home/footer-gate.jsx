"use client";

import { usePathname } from "next/navigation";

export default function FooterGate({ children }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return children;
}
