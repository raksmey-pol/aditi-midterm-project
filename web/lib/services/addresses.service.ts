// lib/services/address.service.ts
import { AddressFormValues } from "@/schemas/address-validation";

export interface AddressResponse {
  id: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  isDefault: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getToken = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No authentication token found");
  return token;
};

export const createAddress = async (
  data: AddressFormValues,
): Promise<AddressResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("RAW BACKEND RESPONSE:", errorText);
    throw new Error("Failed to create address");
  }

  return response.json();
};

export const getMyAddresses = async (): Promise<AddressResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/api/addresses`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error("Failed to fetch addresses");
  const data = await response.json();
  console.log(
    "addresses from backend:",
    data.map((a: AddressResponse) => ({
      label: a.label,
      isDefault: a.isDefault,
    })),
  );
  return data;
};

export const getAddressById = async (id: string): Promise<AddressResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch address");

  return response.json();
};

export const updateAddress = async (
  id: string,
  data: AddressFormValues,
): Promise<AddressResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update address");

  return response.json();
};

export const deleteAddress = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete address");
};
