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

export const createAddress = async (
  data: AddressFormValues,
): Promise<AddressResponse> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No authentication token found");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/addresses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("RAW BACKEND RESPONSE:", errorText);

    throw new Error(
      "Backend did not return a success status. Check the console.",
    );
  }

  return response.json();
};

export const getMyAddresses = async (): Promise<AddressResponse[]> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("No authentication token found");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/addresses`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch addresses");
  }

  return response.json();
};
