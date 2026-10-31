import Header from "@/components/header";
import "./globals.css";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { BRAND_NAME } from "@/lib/brand";

const BUILD_YEAR = new Date().getFullYear();

// Main Global Font: Clash Display Variable
const clashDisplay = localFont({
  src: "../font/ClashDisplay-Variable.ttf",
  variable: "--font-clash",
  display: "swap",
});

// Display Header Font: Trento
const trento = localFont({
  src: "../font/Trento Typeface.ttf",
  variable: "--font-trento",
  display: "swap",
});

export const metadata = {
  title: `${BRAND_NAME.toUpperCase()} | AI-Powered High-Performance Marketplace`,
  description: `Browse verified dealership inventory, search by photo, and book test drives with ${BRAND_NAME}.`,
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${clashDisplay.variable} ${trento.variable}`}>
        <body className="font-[family-name:var(--font-clash)] overflow-x-hidden bg-[#050505] text-white antialiased">
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors theme="dark" />

          <footer className="relative z-20 bg-[#050505] border-t border-white/10 text-white/60 py-6">
            <div className="container mx-auto px-4 text-center text-sm">
              <p>
                &copy; {BUILD_YEAR} {BRAND_NAME}. Verified dealership inventory.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}