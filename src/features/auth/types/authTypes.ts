export type AuthRole = "admin" | "teacher" | "student";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: AuthRole;
  school_id?: number | null;
  class_id?: number | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export type RegisterRole = "student" | "teacher";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: RegisterRole;
  nip?: string | null;
  class_code?: string;
  school_id?: number;
  proposed_school_name?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: AuthUser;
  pending?: boolean;
  error?: string;
}
