import type {
  ApiResponse,
  BulkCreateUsersDTO,
  BulkDeleteUsersDTO,
  BulkUpdateUsersDTO,
  CreateUserDTO,
  UpdateUserDTO,
  User,
  UserFilterParams,
} from "../types/userTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const USERS_URL = `${BASE_URL}/users`;

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

function toQueryString(query?: Record<string, string | number | boolean | undefined>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", body, query } = options;
  const res = await fetch(`${USERS_URL}${path}${toQueryString(query)}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !payload.success) {
    throw new Error(payload.error ?? `Request failed with status ${res.status}`);
  }

  return payload;
}

export const userServices = {
  getUsers: (params?: UserFilterParams) => request<User[]>("/", { query: params as Record<string, string | number | boolean | undefined> }),

  getUserById: (id: number, preload?: boolean) =>
    request<User>(`/${id}`, { query: { preload: preload ?? false } }),

  createUser: (data: CreateUserDTO) =>
    request<User>("/", { method: "POST", body: data }),

  updateUser: (id: number, data: UpdateUserDTO) =>
    request<User>(`/${id}`, { method: "PUT", body: data }),

  deleteUser: (id: number, isPermanent = false) =>
    request<User>(`/${id}`, { method: "DELETE", query: { isPermanent } }),

  bulkCreateUsers: (data: BulkCreateUsersDTO) =>
    request<User[]>("/bulk-create", { method: "POST", body: data }),

  bulkUpdateUsers: (data: BulkUpdateUsersDTO) =>
    request<User[]>("/bulk-update", { method: "PUT", body: data }),

  bulkDeleteUsers: (data: BulkDeleteUsersDTO, isPermanent = false) =>
    request<void>("/bulk-delete", { method: "DELETE", body: data, query: { isPermanent } }),
};

export default userServices;