"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useCartContext } from "@/context/cartcontext";

interface AddToCartButtonProps {
  productId: string;
  inStock: boolean;
}

export default function AddToCartButton({
  productId,
  inStock,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { refetch } = useCartContext();

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

  const handleAddToCart = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    if (!inStock) {
      setError("This product is out of stock");
      return;
    }

    setAdding(true);
    setError(null);
    setSuccess(false);

    try {
      await addItem(productId, 1);
      refetch();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to add to cart:", errorMsg);
      setError("Failed to add item to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleAddToCart}
        disabled={adding || !inStock}
        size="lg"
        className="w-full"
      >
        {adding ? "Adding to cart..." : "Add to Cart"}
      </Button>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          ✓ Added to cart successfully!
        </div>
      )}
    </div>
  );
}
