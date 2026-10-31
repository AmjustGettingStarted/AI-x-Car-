import Header from "@/components/header";
import "./globals.css";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

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
  title: "IGNITE AUTO | AI-Powered High-Performance Marketplace",
  description: "Experience the future of buying, selling, and booking test drives for premium vehicles with AI intelligence.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${clashDisplay.variable} ${trento.variable}`}>
        <body className="font-[family-name:var(--font-clash)] overflow-x-hidden bg-black text-white antialiased">
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          <footer className="bg-[#27251F] text-white py-4">
            <div className="container mx-auto text-center">
              <p>&copy; 2025 AI x CAR | Viva La Vida</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}