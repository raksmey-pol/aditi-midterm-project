"use client";

import Image from "next/image";
import { Product } from "@/lib/services/product.service";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/cartcontext";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthContext } from "@/context/authcontext";

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const { refetch } = useCartContext();
  const { user, isLoggedIn } = useAuthContext();

  const userId = user?.id ?? "";
  const { addItem } = useCart(userId);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const isFavorited = wishlistItems?.some(
    (item: any) => item.id === product.id || item.productId === product.id,
  );

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isFavorited) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
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
    // Added 'relative' to the parent div so the heart button positions correctly inside the card
    <div className="shadow-lg rounded-lg overflow-hidden relative">
      {/* --- ADDED FAVORITE BUTTON --- */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-300"
        aria-label="Toggle Wishlist"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorited
              ? "fill-red-500 text-red-500" // Filled red if favorited
              : "text-gray-500 hover:text-red-500" // Outline if not
          }`}
        />
      </button>
      {/* ----------------------------- */}

      {/* Product Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden group">
          <Image
            src={product.imageUrl || "https://placehold.net/600x600.png"}
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
