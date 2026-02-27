"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { productService, Product } from "@/lib/services/product.service";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/context/authcontext";
import { useCartContext } from "@/context/cartcontext";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, isLoggedIn } = useAuthContext();
  const { refetch } = useCartContext();
  const userId = user?.id ?? "";
  const { addItem } = useCart(userId);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService
      .getProductById(slug)
      .then((p) => {
        setProduct(p);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Product not found");
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (!product) return;
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

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (error || !product)
    return (
      <p className="text-center text-red-500 py-16">
        {error ?? "Product not found"}
      </p>
    );

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-gray-500 hover:text-gray-800 transition"
      >
        ← Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow">
          <Image
            src={product.imageUrl || "https://placehold.net/600x600.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>
          <p className="text-2xl font-bold text-gray-900">${product.price}</p>
          <p
            className={`text-sm ${product.inStock ? "text-green-600" : "text-red-500"}`}
          >
            {product.inStock
              ? `In stock (${product.stockQuantity})`
              : "Out of stock"}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={adding || !product.inStock}
            className="mt-4 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  );
}
