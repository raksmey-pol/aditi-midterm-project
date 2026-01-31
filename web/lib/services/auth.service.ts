import { apiClient, API_CONFIG } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RoleResponse,
  UserResponse,
} from "@/lib/types/auth";

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
   * Get current user
   */
  async getCurrentUser(email: string): Promise<UserResponse> {
    return apiClient.get<UserResponse>(
      `${API_CONFIG.endpoints.auth.me}?email=${encodeURIComponent(email)}`,
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearTokens();
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
  }

  /**
   * Clear all auth data
   */
  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
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
