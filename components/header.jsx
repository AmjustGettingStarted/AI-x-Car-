import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.png";
import { Button } from "./ui/button";
import { ArrowLeft, CarFront, Heart, Layout } from "lucide-react";
import { checkUser } from "@/lib/checkUser";
const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser(); // checks if the user in the database and creates a new user if not

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b ">
      <nav className="mx-auto p-4 flex flex-row items-center justify-between">
        <Link href={isAdminPage ? "/admin" : "/"} className="flex ">
          <Image
            src={logo}
            alt="logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain cursor-pointer"
          />
          {isAdminPage && (
            <span className="text-xs font-extralight">admin</span>
          )}
        </Link>
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={18} />
                <span className="hidden md:inline">Back to App</span>
              </Button>
            </Link>
          ) : (
            <SignedIn>
              <Link href="/saved-cars">
                <Button className="cursor-pointer">
                  <Heart size={18} />
                  <span className="hidden md:inline cursor-pointer">
                    Saved Cars
                  </span>
                </Button>
              </Link>
              {!isAdmin ? (
                <Link href="/reservations">
                  <Button variant="outline" className={`cursor-pointer`}>
                    <CarFront size={18} />
                    <span className="hidden md:inline">My Reservation</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/admin">
                  <Button variant="outline" className="cursor-pointer">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}
          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "w-12 h-12" } }} />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
