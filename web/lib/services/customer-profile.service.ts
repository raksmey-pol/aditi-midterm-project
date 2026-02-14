import { API_CONFIG } from "@/lib/api-client";
import { Customer, ProfileFormData, PasswordFormData } from "../types/customer";

// This simulates the data that WILL come from your database later
const MOCK_CUSTOMER: Customer = {
  id: "cust_12345",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Apt 4B, New York, NY 10001",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", // Random avatar
  stats: {
    totalOrders: 24,
    totalSpending: 2847.50,
    wishlistItems: 12
  }
};

// GET Profile
export async function getCustomerProfile(): Promise<Customer> {
  // Simulate a 500ms delay so you can see the loading spinner briefly
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_CUSTOMER;
}

// UPDATE Profile
export async function updateCustomerProfile(data: ProfileFormData): Promise<Customer> {
  console.log("Static Update Triggered:", data);
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Just return the same data back to satisfy the type
  return { ...MOCK_CUSTOMER, ...data };
}

// CHANGE Password
export async function changePassword(data: PasswordFormData): Promise<{ message: string }> {
  console.log("Static Password Change Triggered:", data);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: "Password updated successfully (Static Mode)" };
}

// // Fetch customer profile
// export async function getCustomerProfile(): Promise<Customer> {
//   const response = await fetch(`${API_CONFIG.endpoints.customer.profile}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       // Add your auth headers here
//       // 'Authorization': `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch customer profile");
//   }

//   return response.json();
// }

// // Update customer profile
// export async function updateCustomerProfile(
//   data: ProfileFormData,
// ): Promise<Customer> {
//   const response = await fetch(`${API_CONFIG.endpoints.customer.profile}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       // Add your auth headers here
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "Failed to update profile");
//   }

//   return response.json();
// }

// // Change password
// export async function changePassword(
//   data: PasswordFormData,
// ): Promise<{ message: string }> {
//   const response = await fetch(`${API_CONFIG.endpoints.customer.changePassword}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // Add your auth headers here
//     },
//     body: JSON.stringify({
//       currentPassword: data.currentPassword,
//       newPassword: data.newPassword,
//     }),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "Failed to change password");
//   }

//   return response.json();
// }