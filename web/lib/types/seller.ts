// Seller types
export interface Product {
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

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  status: string;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingPayouts: number;
  totalProducts: number;
  lowStockCount: number;
  totalSales: number;
  platformFees: number;
}

export interface Payout {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  platformFee: number;
  sellerEarnings: number;
  payoutStatus: string;
  saleDate: string;
}

export interface BulkStockUpdate {
  updates: {
    productId: string;
    newStockQuantity: number;
  }[];
}
