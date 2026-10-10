// Types mapped to the BAJAPRO Go Fiber backend contract.

export type UserRole = "admin" | "teacher" | "student";

export interface School {
  id: number;
  school_name: string;
  isactive: boolean;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface Class {
  id: number;
  school_id: number;
  teacher_id: number | null;
  class_name: string;
  class_code: string;
  isactive: boolean;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  school?: School | null;
  teacher?: User | null;
}

export interface User {
  id: number;
  role: UserRole;
  school_id: number | null;
  class_id: number | null;
  code: string | null;
  name: string;
  email: string;
  password: string;
  nip: string | null;
  avatar_url: string | null;
  is_password_default: boolean;
  approval: number;
  isactive: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Preloaded relations (backend `?preload=true`).
  school?: School | null;
  class?: Class | null;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  nip?: string | null;
  school_id?: number | null;
  class_id?: number | null;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  nip?: string | null;
  role?: UserRole;
  school_id?: number | null;
  class_id?: number | null;
  old_password?: string;
  new_password?: string;
  approval?: number;
  deleted_at?: string | null;
  code?: string | null;
}

export interface UserFilterParams {
  role?: string;
  preload?: boolean;
  limit?: number;
  cursor?: number;
  name?: string;
  sort?: string;
  order?: string;
  show_deleted?: boolean;
}

export interface ClassFilterParams {
  school_id?: number;
  teacher_id?: number;
  preload?: boolean;
}

export interface BulkCreateUsersDTO {
  users: CreateUserDTO[];
}

export interface BulkUpdateUsersDTO {
  ids: number[];
  data: UpdateUserDTO;
}

export interface BulkDeleteUsersDTO {
  ids: number[];
}

export type { ApiResponse } from "@/lib/apiClient";

export const USER_ROLES: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "admin" },
  { label: "Teacher", value: "teacher" },
  { label: "Student", value: "student" },
];
