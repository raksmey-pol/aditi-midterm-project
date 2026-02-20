export type Customer = {
  address: string;
  id: string;
  email: string;
  firstName: string;   // <-- Added!
  lastName: string;    // <-- Added!
  phone: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  permissions: string[];

  stats?: {
    orders: number;
    spent: number;
    reviews: number;
  };
};

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
