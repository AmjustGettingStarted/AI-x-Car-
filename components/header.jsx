import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { checkUser } from "@/lib/checkUser";
import HeaderWrapper from "./header-wrapper";
import SiteNav from "./site-nav";
import { BRAND_NAME } from "@/lib/brand";

const Header = async ({ className = "" }) => {
  const user = await checkUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <HeaderWrapper className={className}>
      <nav className="mx-auto flex max-w-7xl flex-row items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" aria-label={BRAND_NAME} className="flex items-center gap-2">
          <Image
            src={logo}
            alt=""
            width={200}
            height={60}
            sizes="160px"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <SiteNav isAdmin={isAdmin} />
      </nav>
    </HeaderWrapper>
  );
};

export default Header;
