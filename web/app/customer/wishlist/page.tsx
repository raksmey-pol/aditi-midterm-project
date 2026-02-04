"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import { wishlist } from "./product";
import { ProductCard } from "@/components/product-card";

const WishListPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {wishlist.length === 0 ? (
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 p-8">
            <Heart
              strokeWidth={0.5}
              className="h-16 w-16 text-red-500 fill-current"
            />
            <h1 className="text-sm font-normal">Your wishlist is empty.</h1>
            <Link
              className="bg-emerald-600 px-8 py-2 text-sm font-normal rounded-full"
              href={"#"}>
              Shop now
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-5 text-[32px] font-bold uppercase md:mb-6 md:text-[40px]">
            wishlist
          </h1>
          <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
      )}
    </div>
  );
};

export default WishListPage;
