"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SignIn from "./SignIn";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";
import { useAuthContext } from "@/context/authcontext";
import BuyerNavActions from "./BuyerNavActions";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, displayName, clearUser } = useAuthContext();

  const isBuyer = user?.roles?.includes("buyer") ?? false;

  const handleLogout = async () => {
    await authService.logout();
    clearUser();
    router.push("/");
  };

  // Don't render the public navbar inside seller or admin portals
  if (pathname.startsWith("/seller") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        {/* Left: mobile menu + logo */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo clickable={!isLoggedIn || isBuyer} />
        </div>

        {/* Centre: nav links – hidden when logged in */}
        {!isLoggedIn && <HeaderMenu />}
        {isLoggedIn && <div className="hidden md:block w-1/3" />}

        {/* Right: icons + auth */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          {isLoggedIn ? (
            isBuyer ? (
              <BuyerNavActions />
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-lightColor hidden sm:block">
                  {displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-lightColor hover:text-darkColor hover:cursor-pointer hoverEffect"
                >
                  Logout
                </button>
              </div>
            )
          ) : (
            <Link href="/login">
              <SignIn />
            </Link>
          )}
        </div>
      </Container>
    </nav>
  );
}
