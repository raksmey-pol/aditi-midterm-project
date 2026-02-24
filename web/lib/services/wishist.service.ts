const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const fetchWishlist = async () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch wishlist: ${response.status}`);
  }

  return response.json();
};

export const addToWishlist = async (productId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No authentication token found");

  // 1. Remove the /${productId} from the URL
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) throw new Error(`Failed to add: ${response.status}`);
  return response.text();
};

export const removeFromWishlist = async (productId: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to remove from wishlist: ${response.status}`);
  }

  return response.text(); // Backend returns a string, not JSON here
};
