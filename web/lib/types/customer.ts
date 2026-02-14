export interface CustomerStats {
  totalOrders: number;
  totalSpending: number;
  wishlistItems: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  stats: CustomerStats;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
