import { apiClient, API_CONFIG } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RoleResponse,
  UserResponse,
} from "@/lib/types/auth";
import Cookies from "js-cookie";
export class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.endpoints.auth.login,
      credentials,
    );

    // Store tokens
    if (response.accessToken) {
      this.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.endpoints.auth.register,
      data,
    );

    // Store tokens
    if (response.accessToken) {
      this.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  }

  /**
   * Get current user from JWT token
   */
  async getCurrentUser(): Promise<UserResponse> {
    return apiClient.get<UserResponse>(API_CONFIG.endpoints.auth.me);
  }

  /**
   * Logout user - Invalidates token on backend and clears local storage
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint to invalidate token
      await apiClient.post(API_CONFIG.endpoints.auth.logout);
    } catch (error) {
      // Log error but still clear local tokens
      console.error("Logout error:", error);
    } finally {
      // Always clear tokens from local storage
      this.clearTokens();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  /**
   * Get stored user data
   */
  getUser(): UserResponse | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  /**
   * Store tokens and user data
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    Cookies.set("accessToken", accessToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  /**
   * Clear all auth data
   */
  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    Cookies.remove("accessToken");
  }

  /**
   * Store user data
   */
  setUser(user: UserResponse): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Get public roles
   */
  async getPublicRole(): Promise<RoleResponse[]> {
    return apiClient.get<RoleResponse[]>(`${API_CONFIG.endpoints.auth.roles}`);
  }
}

export const authService = new AuthService();
