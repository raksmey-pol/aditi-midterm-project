"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SignIn from "./SignIn";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      // Try stored user object first
      const stored = authService.getUser();
      if (stored) {
        const name = (stored as any).firstName
          ? `${(stored as any).firstName} ${(stored as any).lastName ?? ""}`.trim()
          : (stored as any).fullName || (stored as any).email || "Account";
        setDisplayName(name);
      } else {
        // Fallback: decode JWT payload for a name hint
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setDisplayName(payload.sub || "Account");
        } catch {
          setDisplayName("Account");
        }
      }
    } else {
      setIsLoggedIn(false);
      setDisplayName("");
    }
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setDisplayName("");
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
          <Logo clickable={!isLoggedIn} />
        </div>

        {/* Centre: nav links – hidden when logged in */}
        {!isLoggedIn && <HeaderMenu />}
        {isLoggedIn && <div className="hidden md:block w-1/3" />}

        {/* Right: icons + auth */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          {isLoggedIn ? (
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
