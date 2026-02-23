"use client";

import Link from "next/link";
import { CartItem, CartItemData } from "./CartItem";

interface CartListProps {
  items: CartItemData[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const SHIPPING_THRESHOLD = 100;

export function CartList({ items, onUpdateQuantity, onRemove }: CartListProps) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const progressPercent = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);
  const remaining = (SHIPPING_THRESHOLD - subtotal).toFixed(2);
  const isFreeShipping = subtotal >= SHIPPING_THRESHOLD;

  return (
    <section className="lg:col-span-2">
      {/* Free Shipping Progress Bar */}
     

      {/* Items */}
      <div className="bg-white rounded-2xl px-5 shadow-sm border border-[#F0EBE3]">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="mt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3D5A2A] hover:underline underline-offset-2"
        >
          ← Continue Shopping
        </Link>
      </div>
    </section>
  );
}