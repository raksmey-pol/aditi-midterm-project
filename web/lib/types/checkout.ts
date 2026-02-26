export interface AddressForm {
  label: string;         
  recipientName: string;
  phoneNumber: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
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