import { API_CONFIG } from "@/lib/api-client";
import { Customer, ProfileFormData, PasswordFormData } from "../types/customer";

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

// Fetch customer profile
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

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// 1. Update Profile API Call
export const updateProfile = async (data: UpdateProfilePayload) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No authentication token found");
  console.log("SENDING REQUEST TO: ", API_CONFIG.endpoints.auth.me);
  // Adjust this endpoint to match your Spring Boot backend!
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

// 2. Change Password API Call
export const changePassword = async (data: ChangePasswordPayload) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No authentication token found");

  // Adjust this endpoint to match your Spring Boot backend!
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/auth/change-password`,
    {
      method: "PUT", // or POST depending on your backend
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to change password");
  }

  return response.text(); // Sometimes password changes just return a 200 OK without JSON
};
