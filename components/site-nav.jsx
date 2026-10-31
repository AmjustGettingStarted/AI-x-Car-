"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND_NAME } from "@/lib/brand";

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function linksFor(isAdmin) {
  const links = [{ href: "/cars", label: "Cars" }];
  links.push({ href: "/saved-cars", label: "Saved", signedIn: true });
  if (isAdmin) {
    links.push({ href: "/admin", label: "Admin", signedIn: true });
  } else {
    links.push({ href: "/reservations", label: "Reservations", signedIn: true });
  }
  return links;
}

function NavLinks({ isAdmin, onNavigate, className = "" }) {
  const pathname = usePathname();
  const links = linksFor(isAdmin);

  return (
    <div className={className}>
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        const item = (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`relative px-1 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors ${
              active ? "text-white" : "text-white/65 hover:text-white"
            }`}
          >
            {link.label}
            {active ? (
              <span className="absolute inset-x-0 -bottom-0.5 h-px bg-[#ff4d1a] shadow-[0_0_12px_#ff4d1a]" />
            ) : null}
          </Link>
        );
        if (!link.signedIn) return item;
        return <SignedIn key={link.href}>{item}</SignedIn>;
      })}
    </div>
  );
}

export default function SiteNav({ isAdmin = false }) {
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <NavLinks isAdmin={isAdmin} className="hidden items-center gap-5 md:flex" />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="border-white/15 bg-black/40 text-white hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="border-white/10 bg-[#0b0b0c] text-white">
          <SheetHeader>
            <SheetTitle className="font-[family-name:var(--font-clash)] uppercase tracking-tight text-white">
              {BRAND_NAME}
            </SheetTitle>
            <SheetDescription className="text-white/50">
              Browse inventory, saved cars, and reservations.
            </SheetDescription>
          </SheetHeader>
          <NavLinks
            isAdmin={isAdmin}
            className="mt-8 flex flex-col items-start gap-5"
          />
        </SheetContent>
      </Sheet>

      <SignedOut>
        <SignInButton forceRedirectUrl="/">
          <span className="inline-flex h-9 cursor-pointer items-center rounded-md border border-[#ff4d1a]/35 bg-black/40 px-4 text-sm text-white hover:border-[#ff4d1a] hover:bg-[#ff4d1a]/10">
            Login
          </span>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox:
                "h-10 w-10 border-2 border-[#ff4d1a]/40 hover:border-[#ff4d1a] transition-colors",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
