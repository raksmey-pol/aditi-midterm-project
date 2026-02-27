export type Customer = {
  id: string;
  email: string;
  firstName: string;   // <-- Added!
  lastName: string;    // <-- Added!
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  permissions: string[];
};

export interface CustomerStats {
  totalOrders: number;
  totalSpending: number;
  wishlistItems: number;
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
