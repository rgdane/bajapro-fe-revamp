import { apiRequest } from "@/lib/apiClient";
import type { PistonRunResult } from "../types/sandboxTypes";

export const sandboxServices = {
  run: (code: string, stdin = "") =>
    apiRequest<PistonRunResult>("/code/run", {
      method: "POST",
      body: { language: "java", version: "*", code, stdin },
    }),
};

export default sandboxServices;
