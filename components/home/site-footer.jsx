import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";

const BUILD_YEAR = new Date().getFullYear();

const BROWSE = [
  { href: "/cars", label: "Cars" },
  { href: "/saved-cars", label: "Saved" },
  { href: "/reservations", label: "Reservations" },
];

const SOCIALS = [
  { label: "Instagram", icon: Instagram },
  { label: "X", icon: Twitter },
  { label: "YouTube", icon: Youtube },
];

function ColumnTitle({ children }) {
  return (
    <p className="font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.35em] text-[#ff4d1a]">
      {children}
    </p>
  );
}

export default function SiteFooter({ reveal = false }) {
  return (
    <footer
      className={
        reveal
          ? "fixed inset-x-0 bottom-0 z-0 flex h-[100svh] flex-col justify-between overflow-hidden bg-[#050505] px-5 pb-6 pt-24 sm:px-10 sm:pb-8"
          : "relative z-20 border-t border-white/10 bg-[#050505] px-5 py-14 sm:px-10"
      }
    >
      <p className="max-w-full whitespace-nowrap font-[family-name:var(--font-clash)] text-[11.5vw] font-semibold uppercase leading-[0.8] tracking-[-0.045em] text-white">
        {BRAND_NAME}
      </p>

      <nav
        aria-label="Footer"
        className="grid grid-cols-2 gap-8 py-8 sm:grid-cols-4"
      >
        <div>
          <ColumnTitle>Browse</ColumnTitle>
          <ul className="mt-4 space-y-2">
            {BROWSE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColumnTitle>Company</ColumnTitle>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/cars"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                Test drive
              </Link>
            </li>
            <li>
              <span className="text-sm text-white/40" aria-disabled="true">
                Contact
              </span>
            </li>
          </ul>
        </div>

        <div>
          <ColumnTitle>Legal</ColumnTitle>
          <ul className="mt-4 space-y-2">
            <li>
              <span className="text-sm text-white/40" aria-disabled="true">
                Privacy
              </span>
            </li>
            <li>
              <span className="text-sm text-white/40" aria-disabled="true">
                Terms
              </span>
            </li>
          </ul>
        </div>

        <div>
          <ColumnTitle>Social</ColumnTitle>
          <ul className="mt-4 flex gap-3" aria-label="Social profiles">
            {SOCIALS.map(({ label, icon: Icon }) => (
              <li key={label}>
                <span
                  aria-label={label}
                  role="img"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/35">Profiles coming soon</p>
        </div>
      </nav>

      <p className="border-t border-white/10 pt-4 text-xs text-white/50">
        &copy; {BUILD_YEAR} {BRAND_NAME}. Verified dealership inventory.
      </p>
    </footer>
  );
}
