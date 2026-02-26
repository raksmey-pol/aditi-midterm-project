// Admin TypeScript types

export interface AdminDashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCategories: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  active: boolean;
  emailVerified: boolean;
  createdAt: string;
  roles: string[];
}

export interface AdminProduct {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  buyerId: string;
  status: string;
  totalAmount: number;
  shippingAddress?: string;
  createdAt: string;
  items: AdminOrderItem[];
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  sellerId: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface UpdateUserStatusRequest {
  active: boolean;
}
