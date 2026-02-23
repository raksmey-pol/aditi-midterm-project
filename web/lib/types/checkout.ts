export interface AddressForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  days: string;
}

export interface CheckoutState {
  step: number;
  address: AddressForm | null;
  addressId: string | null;
  shippingMethod: ShippingMethod | null;
  paymentMethod: string;
}