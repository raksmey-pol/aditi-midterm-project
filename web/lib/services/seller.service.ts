import { apiClient, API_CONFIG } from "@/lib/api-client";
import type {
  Product,
  ProductRequest,
  DashboardStats,
  Payout,
  BulkStockUpdate,
  Category,
} from "@/lib/types/seller";

export class SellerService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>(API_CONFIG.endpoints.seller.dashboard);
  }

  /**
   * Create new product
   */
  async createProduct(data: ProductRequest): Promise<Product> {
    return apiClient.post<Product>(API_CONFIG.endpoints.seller.products, data);
  }

  /**
   * Upload product image
   */
  async uploadProductImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.uploadFile<{ imageUrl: string }>(
      API_CONFIG.endpoints.seller.uploadImage,
      formData,
    );
  }

  /**
   * Get all seller products
   */
  async getProducts(): Promise<Product[]> {
    return apiClient.get<Product[]>(API_CONFIG.endpoints.seller.products);
  }

  /**
   * Update product
   */
  async updateProduct(
    productId: string,
    data: ProductRequest,
  ): Promise<Product> {
    return apiClient.put<Product>(
      `${API_CONFIG.endpoints.seller.products}/${productId}`,
      data,
    );
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<void> {
    return apiClient.delete(
      `${API_CONFIG.endpoints.seller.products}/${productId}`,
    );
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(): Promise<Product[]> {
    return apiClient.get<Product[]>(API_CONFIG.endpoints.seller.lowStock);
  }

  /**
   * Bulk update stock quantities
   */
  async bulkUpdateStock(data: BulkStockUpdate): Promise<void> {
    return apiClient.post(API_CONFIG.endpoints.seller.bulkUpdate, data);
  }

  /**
   * Get payouts
   */
  async getPayouts(): Promise<Payout[]> {
    return apiClient.get<Payout[]>(API_CONFIG.endpoints.seller.payouts);
  }

  // Get Category

  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>(API_CONFIG.endpoints.seller.categories);
  }
}

export const sellerService = new SellerService();
