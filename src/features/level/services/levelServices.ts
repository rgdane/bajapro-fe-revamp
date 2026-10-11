import { apiRequest } from "@/lib/apiClient";
import type {
  CreateLevelDTO,
  Level,
  LevelFilterParams,
  UpdateLevelDTO,
} from "../types/levelTypes";

export const levelServices = {
  getLevels: (params?: LevelFilterParams) =>
    apiRequest<Level[]>("/levels", {
      query: params as Record<string, string | number | boolean | undefined>,
    }),

  getLevelById: (id: number) => apiRequest<Level>(`/levels/${id}`),

  createLevel: (data: CreateLevelDTO) =>
    apiRequest<Level>("/levels", { method: "POST", body: data }),

  updateLevel: (id: number, data: UpdateLevelDTO) =>
    apiRequest<Level>(`/levels/${id}`, { method: "PUT", body: data }),

  deleteLevel: (id: number) =>
    apiRequest<null>(`/levels/${id}`, { method: "DELETE" }),
};

export default levelServices;
