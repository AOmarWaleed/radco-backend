// Standard API Responses
export interface ApiErrorResponse {
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

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: {
    id: number;
    name: string;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
  permissions: string[];
}

export interface MeResponse {
  user: User;
  permissions: string[];
}

// Item Code 
export interface ItemCode {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  created_at: string;
  created_by: number | null;
  modification_at: string | null;
  modification_by: number | null;
}

export interface CreateItemCodeRequest {
  code: string;
  name_ar: string;
  name_en: string;
}

// Warehouses
export interface Warehouse {
  id: number;
  name_ar: string;
  name_en: string;
  location: string | null;
  created_at: string;
  created_by: number | null;
  modification_at: string | null;
  modification_by: number | null;
}

export interface CreateWarehouseRequest {
  name_ar: string;
  name_en: string;
  location?: string;
}

// Suppliers
export interface Supplier {
  id: number;
  name_ar: string;
  name_en: string;
  phone: string | null;
  email: string | null;
  created_at: string;
  created_by: number | null;
  modification_at: string | null;
  modification_by: number | null;
}

export interface CreateSupplierRequest {
  name_ar: string;
  name_en: string;
  phone?: string;
  email?: string;
}

// Employees
export interface Employee {
  id: number;
  name_ar: string;
  name_en: string;
  employee_type: string; // 'STOREKEEPER' | 'RECEIVER'
  created_at: string;
  created_by: number | null;
  modification_at: string | null;
  modification_by: number | null;
}

export interface CreateEmployeeRequest {
  name_ar: string;
  name_en: string;
  employee_type: string;
}

// Items (Stock Movements)
export interface Item {
  item_id: number;
  item_code_id: number;
  item_code?: ItemCode; // Included in JOINs
  unit: string | null;
  quantity: string | number;
  warehouse_id: number | null;
  warehouse?: Warehouse;
  employee_id: number | null;
  employee?: Employee;
  supplier_id: number | null;
  supplier?: Supplier;
  installation_site: string | null;
  action_type: string; // 'IN' | 'OUT' | 'BALANCE'
  action_date: string | null;
  created_at: string;
  created_by: number | null;
  modification_at: string | null;
  modification_by: number | null;
}

export interface CreateItemRequest {
  item_code_id: number;
  unit?: string;
  quantity: number;
  warehouse_id?: number;
  employee_id?: number;
  supplier_id?: number;
  installation_site?: string;
  action_type: string;
  action_date?: string;
}