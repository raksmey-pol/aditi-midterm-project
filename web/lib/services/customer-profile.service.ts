import { apiClient, API_CONFIG } from "@/lib/api-client";
import { Customer, CustomerStats, PasswordFormData } from "../types/customer";

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

export async function getCustomerProfile(): Promise<Customer> {
  return apiClient.get<Customer>(API_CONFIG.endpoints.auth.me);
}

export const updateProfile = async (data: UpdateProfilePayload) => {
  return apiClient.put<Customer>(API_CONFIG.endpoints.auth.me, data);
};

export type ChangePasswordPayload = Omit<PasswordFormData, "confirmPassword">;
export const changePassword = async (data: ChangePasswordPayload) => {
  return apiClient.put<unknown>(API_CONFIG.endpoints.auth.changePassword, data);
};

export const fetchCustomerStats = async (): Promise<CustomerStats> => {
  return apiClient.get<CustomerStats>(API_CONFIG.endpoints.buyer.stats);
};
