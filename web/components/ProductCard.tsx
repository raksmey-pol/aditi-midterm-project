"use client";

import Image from "next/image";
import { Product } from "@/lib/services/product.service";
import Link from "next/link";
import { Heart } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden ">
      {product.imageUrl && (
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-square w-full overflow-hidden group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
            <button className="absolute top-2 right-2 p-2 bg-white/15 hover:bg-white/20 rounded-full">
              <Heart className="h-5 w-5 text-red-500 fill-current" />
            </button>
          </div>
        </Link>
      )}
      {/* Product Info */}
      <div className="flex flex-col gap-4 p-4">
        <h1 className="font-medium">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.description}</p>
        {/* PRODUCT TYPES (removed, not in backend model) */}
        {/* PRICE AND CART BUTTON */}
        <div className="flex justify-between items-center">
          <span className="font-bold">${product.price}</span>
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
