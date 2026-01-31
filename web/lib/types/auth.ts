// Authentication types
export interface LoginRequest {
  email: string;
  passwordHash: string;
}

export interface RegisterRequest {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleId: string;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  active: boolean;
  roles: string[];
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface ApiError {
  message: string;
}

export interface RoleResponse {
  id: string;
  name: string;
}
