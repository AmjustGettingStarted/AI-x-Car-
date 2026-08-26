import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.png";
import { Button } from "./ui/button";
import { ArrowLeft, CarFront, Heart, Layout } from "lucide-react";
import { checkUser } from "@/lib/checkUser";
import HeaderWrapper from "./header-wrapper";

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <HeaderWrapper isAdminPage={isAdminPage}>
      <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-row items-center justify-between">
        {/* Logo */}
        <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center gap-2 group">
          <Image
            src={logo}
            alt="logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
          />
          {isAdminPage && (
            <span className="text-[10px] font-semibold tracking-wider text-orange-500 uppercase px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30">
              Admin
            </span>
          )}
        </Link>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <SignedIn>
            {isAdminPage ? (
              /* Admin Page Navigation: Primary Deep Glow Button */
              <Link href="/">
                <Button className="cursor-pointer bg-gradient-to-r from-[#d94600] to-[#b33600] hover:from-[#f04e00] hover:to-[#c73d00] text-white font-medium shadow-[0_0_20px_rgba(217,70,0,0.35)] border border-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  <ArrowLeft size={18} className="text-white" />
                  <span className="hidden md:inline">Back to App</span>
                </Button>
              </Link>
            ) : (
              /* Main App Navigation */
              <>
                {/* Secondary Action: Dark Glassmorphism with Subtle Orange Stroke */}
                <Link href="/saved-cars">
                  <Button
                    variant="outline"
                    className="group cursor-pointer border border-orange-500/30 bg-black/40 hover:bg-orange-500/15 hover:border-orange-500/60 text-white hover:text-white transition-all duration-300 backdrop-blur-md"
                  >
                    <Heart
                      size={18}
                      className="text-orange-500 transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="hidden md:inline cursor-pointer font-medium">
                      Saved Cars
                    </span>
                  </Button>
                </Link>

                {!isAdmin ? (
                  <Link href="/reservations">
                    <Button
                      variant="outline"
                      className="group cursor-pointer border border-orange-500/30 bg-black/40 hover:bg-orange-500/15 hover:border-orange-500/60 text-white hover:text-white transition-all duration-300 backdrop-blur-md"
                    >
                      <CarFront
                        size={18}
                        className="text-orange-500 transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="hidden md:inline font-medium">My Reservation</span>
                    </Button>
                  </Link>
                ) : (
                  /* Primary Action: Deep Glow Admin Button matching central hero column */
                  <Link href="/admin">
                    <Button className="cursor-pointer bg-gradient-to-r from-[#d94600] to-[#b33600] hover:from-[#f04e00] hover:to-[#c73d00] text-white font-medium shadow-[0_0_20px_rgba(217,70,0,0.35)] border border-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                      <Layout size={18} className="text-white" />
                      <span className="hidden md:inline">Admin Portal</span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button className="cursor-pointer bg-gradient-to-r from-[#d94600] to-[#b33600] hover:from-[#f04e00] hover:to-[#c73d00] text-white font-medium px-5 shadow-[0_0_20px_rgba(217,70,0,0.35)] border border-orange-500/40 transition-all duration-300 hover:scale-105">
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-orange-500/40 hover:border-orange-500 transition-all",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </HeaderWrapper>
  );
};

export default Header;