// lib/api/orders.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const fetchMyOrders = async () => {
  // 1. Safely check for window/localStorage to prevent Next.js SSR crashes
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) {
    throw new Error("No authentication token found");
  }

  // 2. Add a console.log here to prove the function is running!
  console.log("Attempting to fetch with URL:", `${API_BASE_URL}/orders/mine`);

  const response = await fetch(`${API_BASE_URL}/orders/mine`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  return response.json();
};
