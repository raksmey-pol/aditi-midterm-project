"use client";

import Image from "next/image";
import { ProductType } from "@/constans/types";
import Link from "next/link";

const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden ">

      {/* Product Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden group">
          <Image
            src={product.image.color}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition duration-500"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col gap-4 p-4">
        <h1 className="font-medium">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.description}</p>
        {/* PRODUCT TYPES */}
        <div className="flex items-center gap-4 text-xs ">
            {/* SIZES */}
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Size</span>
              <select name="size" id="size" className="ring ring-gray-300 rounded-md px-2 py-1">
                {product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            {/* COLORS */}
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Color</span>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                    <div key={color} className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }}>
                        
                    </div>
                ))}
              </div>
            </div>
        </div>
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
