// ─── Request Types ────────────────────────────────────────────────────────────

export interface AddToCartRequest {
  productId: string; // UUID
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  sellerId: string; // ← is this here?
  imageUrl: string; // ← add this
  category: string; // ← add this
  unitPrice: number; // ← also fix this! backend sends "unitPrice" not "price"
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  cartId: string; // UUID
  userId: string; // UUID
  items: CartItem[];
  totalPrice: number;
}
