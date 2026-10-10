import { apiRequest } from "@/lib/apiClient";
import type {
  CreateSchoolDTO,
  School,
  SchoolFilterParams,
  UpdateSchoolDTO,
} from "../types/schoolTypes";

export const schoolServices = {
  getSchools: (params?: SchoolFilterParams) =>
    apiRequest<School[]>("/school", {
      query: params as Record<string, string | number | boolean | undefined>,
    }),

  getSchoolById: (id: number, preload = true) =>
    apiRequest<School>(`/school/${id}`, { query: { preload } }),

  createSchool: (data: CreateSchoolDTO) =>
    apiRequest<School>("/school", { method: "POST", body: data }),

  updateSchool: (id: number, data: UpdateSchoolDTO) =>
    apiRequest<School>(`/school/${id}`, { method: "PUT", body: data }),

  deleteSchool: (id: number) =>
    apiRequest<null>(`/school/${id}`, { method: "DELETE" }),
};

export default schoolServices;
