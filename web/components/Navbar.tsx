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

type StoredUser = {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
};

const getAuthSnapshot = (): { isLoggedIn: boolean; displayName: string } => {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, displayName: "" };
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    return { isLoggedIn: false, displayName: "" };
  }

  const stored = authService.getUser() as StoredUser | null;
  if (stored) {
    const name = stored.firstName
      ? `${stored.firstName} ${stored.lastName ?? ""}`.trim()
      : stored.fullName || stored.email || "Account";

    return { isLoggedIn: true, displayName: name };
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { isLoggedIn: true, displayName: payload.sub || "Account" };
  } catch {
    return { isLoggedIn: true, displayName: "Account" };
  }
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState(getAuthSnapshot);
  const { isLoggedIn, displayName } = authState;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const syncAuth = () => setAuthState(getAuthSnapshot());
    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setAuthState({ isLoggedIn: false, displayName: "" });
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
          {hasMounted && <Logo clickable={!isLoggedIn} />}
        </div>

        {/* Centre: nav links */}
        <HeaderMenu />

        {/* Right: icons + auth */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          {hasMounted ? (
            isLoggedIn ? (
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
            )
          ) : null}
        </div>
      </Container>
    </nav>
  );
}
