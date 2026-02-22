import { API_CONFIG } from "@/lib/api-client";
import { Customer, ProfileFormData, PasswordFormData } from "../types/customer";

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

export async function getCustomerProfile(): Promise<Customer> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/auth/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch customer profile");
  }

  return response.json();
}

export const updateProfile = async (data: UpdateProfilePayload) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No authentication token found");
  console.log("SENDING REQUEST TO: ", API_CONFIG.endpoints.auth.me);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/auth/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update profile");
  }

  return response.json();
};

export type ChangePasswordPayload = Omit<PasswordFormData, "confirmPassword">;
export const changePassword = async (data: ChangePasswordPayload) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/auth/change-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  // 1. Read the raw text first instead of jumping straight to .json()
  const text = await response.text();

  // 2. Safely try to parse it, or default to an empty object if it's blank
  const responseData = text ? JSON.parse(text) : {};

  // 3. Handle errors
  if (!response.ok) {
    throw new Error(responseData.message || "Failed to change password");
  }

  return responseData;
};