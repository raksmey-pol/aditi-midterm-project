export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  endpoints: {
    auth: {
      login: "/api/auth/login",
      register: "/api/auth/register",
      logout: "/api/auth/logout",
      me: "/api/auth/me",
      roles: "/api/auth/roles",
    },
    seller: {
      dashboard: "/api/seller/dashboard",
      products: "/api/seller/products",
      uploadImage: "/api/seller/products/upload-image",
      lowStock: "/api/seller/inventory/low-stock",
      bulkUpdate: "/api/seller/inventory/bulk-update",
      payouts: "/api/seller/payouts",
    },
    buyer: {
      orders: "buyer/orders",
      wishlist: "buyer/wishlist",
      profile: "buyer/profile",
      changePassword: "buyer/change-password",
    },
    products: {
      list: "/api/products",
      categories: "/api/products/categories",
    },
    admin: {
      dashboard: "/api/admin/dashboard",
      users: "/api/admin/users",
      products: "/api/admin/products",
      orders: "/api/admin/orders",
      categories: "/api/admin/categories",
    },
  },
};

// HTTP Client with error handling
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.baseURL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Merge existing headers
    if (options.headers) {
      const existingHeaders = new Headers(options.headers);
      existingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData: any = null;

        // Try to parse response body
        const contentType = response.headers.get("content-type");
        try {
          if (contentType?.includes("application/json")) {
            errorData = await response.json();
            // Extract error message from common error response formats
            errorMessage =
              errorData.message ||
              errorData.error ||
              errorData.errorMessage ||
              errorMessage;
          } else {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          // If parsing fails, use the default HTTP status message
          console.warn("Failed to parse error response:", parseError);
        }

        // Log detailed error info for debugging
        console.error("API Error:", {
          url,
          status: response.status,
          statusText: response.statusText,
          message: errorMessage,
          data: errorData,
        });

        throw new Error(errorMessage);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      // Check if this is a network error (backend not running)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const networkError = `Backend server is not running at ${this.baseURL}. Please start the Spring Boot backend.`;
        console.error("Network Error:", {
          url,
          baseURL: this.baseURL,
          error: networkError,
        });
        throw new Error(networkError);
      }

      // Re-throw errors we created (HTTP errors)
      if (error instanceof Error && error.message.startsWith("HTTP")) {
        throw error;
      }

      // Other unexpected errors
      if (error instanceof Error) {
        throw error;
      }

      console.error("Unexpected Error:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch {}
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Token management
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", token);
  }

  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export const apiClient = new ApiClient();
