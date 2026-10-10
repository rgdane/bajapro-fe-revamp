import { apiRequest } from "./apiClient";
import type {
  BulkCreateUsersDTO,
  BulkDeleteUsersDTO,
  BulkUpdateUsersDTO,
  Class,
  ClassFilterParams,
  CreateUserDTO,
  School,
  UpdateUserDTO,
  User,
  UserFilterParams,
} from "../types/userTypes";

export const userServices = {
  getUsers: (params?: UserFilterParams) =>
    apiRequest<User[]>("/users", {
      query: params as Record<string, string | number | boolean | undefined>,
    }),

  getUserById: (id: number, preload = true) =>
    apiRequest<User>(`/users/${id}`, { query: { preload } }),

  createUser: (data: CreateUserDTO) =>
    apiRequest<User>("/users", { method: "POST", body: data }),

  updateUser: (id: number, data: UpdateUserDTO) =>
    apiRequest<User>(`/users/${id}`, { method: "PUT", body: data }),

  deleteUser: (id: number, isPermanent = false) =>
    apiRequest<User>(`/users/${id}`, {
      method: "DELETE",
      query: { isPermanent },
    }),

  bulkCreateUsers: (data: BulkCreateUsersDTO) =>
    apiRequest<User[]>("/users/bulk-create", { method: "POST", body: data }),

  bulkUpdateUsers: (data: BulkUpdateUsersDTO) =>
    apiRequest<User[]>("/users/bulk-update", { method: "PUT", body: data }),

  bulkDeleteUsers: (data: BulkDeleteUsersDTO, isPermanent = false) =>
    apiRequest<void>("/users/bulk-delete", {
      method: "DELETE",
      body: data,
      query: { isPermanent },
    }),

  getSchools: () => apiRequest<School[]>("/school"),

  getClasses: (params?: ClassFilterParams) =>
    apiRequest<Class[]>("/class", {
      query: params as Record<string, string | number | boolean | undefined>,
    }),
};

export default userServices;

