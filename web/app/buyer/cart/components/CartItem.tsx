"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
  size?: string;
  color?: string;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  return (
    <div className="flex items-start gap-4 py-5 border-b border-[#E8E0D5] last:border-none group">
      {/* Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F5F0EA]">
        <Image
          src={item.image || "https://placehold.net/600x600.png"}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {item.category && (
          <span className="text-xs font-medium uppercase tracking-widest text-[#8A7E6F]">
            {item.category}
          </span>
        )}

        <h3 className="font-semibold text-[#1A1A1A] text-sm leading-tight truncate">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 mt-0.5">
          {item.size && (
            <span className="text-xs text-[#8A7E6F] bg-[#F0EBE3] px-2 py-0.5 rounded-md">
              Size: {item.size}
            </span>
          )}
          {item.color && (
            <span className="text-xs text-[#8A7E6F] bg-[#F0EBE3] px-2 py-0.5 rounded-md">
              {item.color}
            </span>
          )}
        </div>

        {/* Qty + Price */}
        <div className="flex items-center justify-between mt-3">
          {/* Stepper */}
          <div className="flex items-center gap-2 bg-[#F5F0EA] rounded-full px-1 py-1">
            <button
              onClick={handleDecrement}
              className="h-6 w-6 flex items-center justify-center rounded-full text-[#3D5A2A] hover:bg-[#3D5A2A] hover:text-white transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-[#1A1A1A]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="h-6 w-6 flex items-center justify-center rounded-full text-[#3D5A2A] hover:bg-[#3D5A2A] hover:text-white transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Price + Delete */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#3D5A2A]">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="text-[#C0B5A8] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Remove item"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
