"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useCartContext } from "@/context/cartcontext";
const CartIcon = () => {
  const { itemCount } = useCartContext();
  // console.log("itemCount:", itemCount);
  return (
    <Link href={"/buyer/cart"} className="group relative">
      <ShoppingBag className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
          {itemCount}
        </span>
      )}

    </Link>
  );
};

export default CartIcon;