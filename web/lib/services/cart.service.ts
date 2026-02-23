import { AddToCartRequest, CartResponse, UpdateCartItemRequest } from '../types/cart';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CART_URL = `${BASE_URL}/api/v1/carts`;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const cartService = {
  getCart: async (userId: string): Promise<CartResponse> => {
    const res = await fetch(`${CART_URL}/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },

  addItem: async (userId: string, body: AddToCartRequest): Promise<CartResponse> => {
    const res = await fetch(`${CART_URL}/${userId}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to add item to cart');
    return res.json();
  },

  updateItem: async (cartItemId: string, body: UpdateCartItemRequest): Promise<void> => {
    const res = await fetch(`${CART_URL}/items/${cartItemId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to update cart item');
  },

  removeItem: async (cartItemId: string): Promise<void> => {
    const res = await fetch(`${CART_URL}/items/${cartItemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove item');
  },

  clearCart: async (cartId: string): Promise<void> => {
    const res = await fetch(`${CART_URL}/${cartId}/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to clear cart');
  },
};