import { apiClient, API_CONFIG } from "@/lib/api-client";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  inStock: boolean;
}

export interface ProductsResponse {
  content: Product[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ProductFilters {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export class ProductService {
  /**
   * Get all products with pagination and filtering
   */
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    if (filters?.page !== undefined)
      params.append("page", filters.page.toString());
    if (filters?.size !== undefined)
      params.append("size", filters.size.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortDir) params.append("sortDir", filters.sortDir);

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_CONFIG.endpoints.products.list}?${queryString}`
      : API_CONFIG.endpoints.products.list;

    return apiClient.get<ProductsResponse>(endpoint);
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(
      `${API_CONFIG.endpoints.products.list}/${id}`,
    );
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>(API_CONFIG.endpoints.products.categories);
  }
}

export const productService = new ProductService();
