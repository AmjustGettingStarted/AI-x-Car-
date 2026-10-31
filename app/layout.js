import Header from "@/components/header";
import FooterGate from "@/components/home/footer-gate";
import SiteFooter from "@/components/home/site-footer";
import "./globals.css";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { BRAND_NAME } from "@/lib/brand";

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

          <FooterGate>
            <SiteFooter />
          </FooterGate>
        </body>
      </html>
    </ClerkProvider>
  );
}