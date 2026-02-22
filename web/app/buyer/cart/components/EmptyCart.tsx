"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#F5F0EA]">
        <ShoppingBag size={40} className="text-[#C0B5A8]" strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#3D5A2A] text-[10px] font-bold text-white">
          0
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Your cart is empty</h2>
        <p className="text-sm text-[#8A7E6F] max-w-xs">
          Looks like you haven&apos;t added anything yet. Explore our store and
          find something you&apos;ll love.
        </p>
      </div>

      <Link
        href="/"
        className="mt-2 bg-[#3D5A2A] hover:bg-[#2D4520] text-white rounded-xl px-8 h-11 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
      >
        Continue Shopping
      </Link>
    </div>
  );
}