export interface Role {
  id: number;
  name: string;
  description: string | null;
}

export interface Permission {
  id: number;
  key: string;
  description: string | null;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Item {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  category: string | null;
  unit: string;
  quantity: string; // numeric comes as string from pg
  created_at: Date;
  created_by: number | null;
}

export interface ItemCodeSequence {
  prefix: string;
  year: number;
  last_number: number;
  updated_at: Date;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
