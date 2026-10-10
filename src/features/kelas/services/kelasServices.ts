import { apiRequest } from "@/lib/apiClient";
import type {
  CreateKelasDTO,
  Kelas,
  KelasFilterParams,
  TeacherRef,
  UpdateKelasDTO,
} from "../types/kelasTypes";

export const kelasServices = {
  getClasses: (params?: KelasFilterParams) =>
    apiRequest<Kelas[]>("/class", {
      query: params as Record<string, string | number | boolean | undefined>,
    }),

  getClassById: (id: number, preload = true) =>
    apiRequest<Kelas>(`/class/${id}`, { query: { preload } }),

  createClass: (data: CreateKelasDTO) =>
    apiRequest<Kelas>("/class", { method: "POST", body: data }),

  updateClass: (id: number, data: UpdateKelasDTO) =>
    apiRequest<Kelas>(`/class/${id}`, { method: "PUT", body: data }),

  deleteClass: (id: number) =>
    apiRequest<null>(`/class/${id}`, { method: "DELETE" }),

  // Teacher sebagai reference untuk dropdown wali kelas.
  getTeachers: () => apiRequest<TeacherRef[]>("/users", { query: { role: "teacher" } }),
};

export default kelasServices;
