export interface Role {
  id: number;
  name: string;
}

export interface Class {
  id: number;
  class_name: string;
  school_name: string;
  class_code: string;
  isactive: boolean;
}

export interface User {
  id: number;
  role_id: number;
  class_id: number | null;
  code: string | null;
  name: string;
  email: string;
  password: string;
  nip: string | null;
  school_instance: string | null;
  avatar_url: string | null;
  is_password_default: boolean;
  approval: number;
  isactive: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  has_roles: Role[];
  class: Class | null;
}

export interface CreateUserDTO {
  code?: string | null;
  name: string;
  email: string;
  password: string;
  is_password_default?: boolean;
}

export interface UpdateUserDTO {
  code?: string | null;
  name?: string;
  email?: string;
  password?: string;
  old_password?: string;
  new_password?: string;
  class_id?: number;
  has_roles?: number[];
  is_password_default?: boolean;
  deleted_at?: string | null;
  approval?: number;
}

export interface UserFilterParams {
  squad_id?: number;
  role_id?: number;
  preload?: boolean;
  limit?: number;
  cursor?: number;
  name?: string;
  sort?: string;
  order?: string;
  show_deleted?: boolean;
}

export interface BulkCreateUsersDTO {
  users: CreateUserDTO[];
}

export interface BulkUpdateUsersDTO {
  ids: number[];
  data: UpdateUserDTO;
  has_roles?: number[];
}

export interface BulkDeleteUsersDTO {
  ids: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
  error?: string;
}