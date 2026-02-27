import { AddressResponse } from "@/lib/services/addresses.service";

export interface CheckoutState {
  step: number;
  address: AddressResponse | null; // ← was AddressForm
  addressId: string | null;
  shippingMethod: ShippingMethod | null;
  paymentMethod: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  days: string;
}
