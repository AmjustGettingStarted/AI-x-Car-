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
        <Link
          href={isAdminPage ? "/admin" : "/"}
          className="flex items-center gap-2 group"
        >
          <Image
            src={logo}
            alt="logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain cursor-pointer transition-transform duration-300 ease-out group-hover:scale-105"
          />

          {isAdminPage && (
            <span className="text-[10px] font-semibold tracking-wider text-[#FF5F1F] uppercase px-2 py-0.5 rounded-full bg-[#FF5F1F]/10 border border-[#FF5F1F]/30">
              Admin
            </span>
          )}
        </Link>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <SignedIn>
            {isAdminPage ? (
              /* Admin Page Navigation */
              <Link href="/">
                <Button
                  variant="outline"
                  className="
                    group
                    cursor-pointer
                    border border-[#FF5F1F]/35
                    bg-black/40
                    hover:bg-[#FF5F1F]/10
                    hover:border-[#FF5F1F]/80
                    text-white
                    hover:text-white
                    backdrop-blur-md
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-0.5
                    hover:shadow-[0_8px_30px_rgba(255,95,31,0.15)]
                    active:translate-y-0
                    active:scale-[0.98]
                  "
                >
                  <ArrowLeft
                    size={18}
                    className="
                      text-[#FF5F1F]
                      transition-transform
                      duration-300
                      group-hover:-translate-x-0.5
                    "
                  />

                  <span className="hidden md:inline font-medium">
                    Back to App
                  </span>
                </Button>
              </Link>
            ) : (
              <>
                {/* Saved Cars */}
                <Link href="/saved-cars">
                  <Button
                    variant="outline"
                    className="
                      group
                      cursor-pointer
                      border border-[#FF5F1F]/35
                      bg-black/40
                      hover:bg-[#FF5F1F]/10
                      hover:border-[#FF5F1F]/80
                      text-white
                      hover:text-white
                      backdrop-blur-md
                      transition-all
                      duration-300
                      ease-out
                      hover:-translate-y-0.5
                      hover:shadow-[0_8px_30px_rgba(255,95,31,0.15)]
                      active:translate-y-0
                      active:scale-[0.98]
                    "
                  >
                    <Heart
                      size={18}
                      className="
                        text-[#FF5F1F]
                        transition-all
                        duration-300
                        ease-out
                        group-hover:scale-110
                        group-hover:-rotate-3
                      "
                    />

                    <span className="hidden md:inline cursor-pointer font-medium">
                      Saved Cars
                    </span>
                  </Button>
                </Link>

                {!isAdmin ? (
                  /* Reservations */
                  <Link href="/reservations">
                    <Button
                      variant="outline"
                      className="
                        group
                        cursor-pointer
                        border border-[#FF5F1F]/35
                        bg-black/40
                        hover:bg-[#FF5F1F]/10
                        hover:border-[#FF5F1F]/80
                        text-white
                        hover:text-white
                        backdrop-blur-md
                        transition-all
                        duration-300
                        ease-out
                        hover:-translate-y-0.5
                        hover:shadow-[0_8px_30px_rgba(255,95,31,0.15)]
                        active:translate-y-0
                        active:scale-[0.98]
                      "
                    >
                      <CarFront
                        size={18}
                        className="
                          text-[#FF5F1F]
                          transition-all
                          duration-300
                          ease-out
                          group-hover:scale-110
                          group-hover:-rotate-3
                        "
                      />

                      <span className="hidden md:inline font-medium">
                        My Reservation
                      </span>
                    </Button>
                  </Link>
                ) : (
                  /* Admin Portal - Styled like Saved Cars */
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      className="
                        group
                        cursor-pointer
                        border border-[#FF5F1F]/35
                        bg-black/40
                        hover:bg-[#FF5F1F]/10
                        hover:border-[#FF5F1F]/80
                        text-white
                        hover:text-white
                        backdrop-blur-md
                        transition-all
                        duration-300
                        ease-out
                        hover:-translate-y-0.5
                        hover:shadow-[0_8px_30px_rgba(255,95,31,0.15)]
                        active:translate-y-0
                        active:scale-[0.98]
                      "
                    >
                      <Layout
                        size={18}
                        className="
                          text-[#FF5F1F]
                          transition-all
                          duration-300
                          ease-out
                          group-hover:scale-110
                          group-hover:rotate-6
                        "
                      />

                      <span className="hidden md:inline font-medium">
                        Admin Portal
                      </span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button
                variant="outline"
                className="
                  group
                  cursor-pointer
                  border border-[#FF5F1F]/35
                  bg-black/40
                  hover:bg-[#FF5F1F]/10
                  hover:border-[#FF5F1F]/80
                  text-white
                  hover:text-white
                  backdrop-blur-md
                  px-5
                  transition-all
                  duration-300
                  ease-out
                  hover:-translate-y-0.5
                  hover:shadow-[0_8px_30px_rgba(255,95,31,0.15)]
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 border-2 border-[#FF5F1F]/40 hover:border-[#FF5F1F] hover:scale-105 transition-all duration-300 ease-out",
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