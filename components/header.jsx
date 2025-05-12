import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/logo.png";
const Header = () => {
  return (
    <header>
      <nav>
        <Link href={"/"}>
          <Image src={logo} alt="logo" width={50} height={40} />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
