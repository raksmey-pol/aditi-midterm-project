"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  User,
  Package,
  CreditCard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCartContext } from "@/context/cartcontext";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthContext } from "@/context/authcontext";
import { authService } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";

export default function BuyerNavActions() {
  const { itemCount } = useCartContext();
  const { wishlistItems } = useWishlist();
  const { displayName, clearUser } = useAuthContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await authService.logout();
    clearUser();
    router.push("/");
  };

  const navItems = [
    { href: "/buyer/profile", label: "Profile", icon: User },
    { href: "/buyer/orders", label: "Orders", icon: Package },
    { href: "/buyer/checkout", label: "Checkout", icon: CreditCard },
    { href: "/buyer/wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Wishlist icon */}
      <Link href="/buyer/wishlist" className="relative group" title="Wishlist">
        <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
        {wishlistItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-[10px] font-semibold flex items-center justify-center">
            {wishlistItems.length}
          </span>
        )}
      </Link>

      {/* Cart icon */}
      <Link href="/buyer/cart" className="relative group" title="Cart">
        <ShoppingCart className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-[10px] font-semibold flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>

      {/* User dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-lightColor hover:text-darkColor hoverEffect"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:block max-w-30 truncate">
            {displayName}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white shadow-lg py-1 z-50">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-shop_dark_green transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
            <hr className="my-1 border-gray-100" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
