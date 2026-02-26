import { apiClient, API_CONFIG } from "@/lib/api-client";
import type {
  AdminDashboardStats,
  AdminUser,
  AdminProduct,
  AdminOrder,
  AdminCategory,
  UpdateUserStatusRequest,
} from "@/lib/types/admin";

export class AdminService {
  // ── Dashboard ────────────────────────────────────────────────
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return apiClient.get<AdminDashboardStats>(
      API_CONFIG.endpoints.admin.dashboard,
    );
  }

  // ── Users ────────────────────────────────────────────────────
  async getAllUsers(): Promise<AdminUser[]> {
    return apiClient.get<AdminUser[]>(API_CONFIG.endpoints.admin.users);
  }

  async setUserStatus(userId: string, active: boolean): Promise<AdminUser> {
    const body: UpdateUserStatusRequest = { active };
    return apiClient.put<AdminUser>(
      `${API_CONFIG.endpoints.admin.users}/${userId}/status`,
      body,
    );
  }

  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete(`${API_CONFIG.endpoints.admin.users}/${userId}`);
  }

  // ── Products ─────────────────────────────────────────────────
  async getAllProducts(): Promise<AdminProduct[]> {
    return apiClient.get<AdminProduct[]>(API_CONFIG.endpoints.admin.products);
  }

  async deleteProduct(productId: string): Promise<void> {
    return apiClient.delete(
      `${API_CONFIG.endpoints.admin.products}/${productId}`,
    );
  }

  // ── Orders ──────────────────────────────────────────────────
  async getAllOrders(): Promise<AdminOrder[]> {
    return apiClient.get<AdminOrder[]>(API_CONFIG.endpoints.admin.orders);
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
  ): Promise<AdminOrder> {
    return apiClient.patch<AdminOrder>(
      `${API_CONFIG.endpoints.admin.orders}/${orderId}/status?status=${status}`,
      {},
    );
  }

  // ── Categories ───────────────────────────────────────────────
  async getAllCategories(): Promise<AdminCategory[]> {
    return apiClient.get<AdminCategory[]>(
      API_CONFIG.endpoints.admin.categories,
    );
  }

  async createCategory(
    data: Omit<AdminCategory, "id" | "createdAt">,
  ): Promise<AdminCategory> {
    return apiClient.post<AdminCategory>(
      API_CONFIG.endpoints.admin.categories,
      data,
    );
  }

  async updateCategory(
    id: string,
    data: Omit<AdminCategory, "id" | "createdAt">,
  ): Promise<AdminCategory> {
    return apiClient.put<AdminCategory>(
      `${API_CONFIG.endpoints.admin.categories}/${id}`,
      data,
    );
  }

  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete(`${API_CONFIG.endpoints.admin.categories}/${id}`);
  }
}

export const adminService = new AdminService();
