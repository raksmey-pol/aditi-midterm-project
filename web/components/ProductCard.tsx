"use client";

import Image from "next/image";
import { Product } from "@/lib/services/product.service";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation"; // ← add this
import { useCartContext } from "@/context/cartcontext";

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter(); // ← add this
  const [adding, setAdding] = useState(false);
  const { refetch } = useCartContext();
  // const [userId] = useState<string>(() => {
  //   if (typeof window === "undefined") return "";
  //   return localStorage.getItem("userId") ?? "";
  // });

  const [userId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const user = localStorage.getItem("user");
    if (!user) return "";
    try {
      return JSON.parse(user).id ?? "";
    } catch {
      return "";
    }
  });
  const { addItem } = useCart(userId);

  const imageSrc =
    typeof product.imageUrl === "string" && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : "/images/placeholder.png";

const handleAddToCart = async () => {
  if (!userId) {
    router.push("/login");
    return;
  }

  setAdding(true);
  try {
    await addItem(product.id, 1); 
    refetch(); 
  } catch (err) {
    console.error("Failed to add to cart", err);
  } finally {
    setAdding(false);
  }
};

  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      {/* Product Image */}
      <Link href={`/products/${encodeURIComponent(product.id)}`}>
        <div className="relative w-full aspect-square overflow-hidden group bg-gray-100">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={imageSrc.startsWith("http")}
            className="object-cover group-hover:scale-110 transition duration-500"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col gap-4 p-4">
        <h1 className="font-medium">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.description}</p>

        {/* PRICE AND CART BUTTON */}
        <div className="flex justify-between items-center">
          <span className="font-bold">${product.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
