import { apiRequest } from "@/lib/apiClient";
import type {
  RegistrationRequest,
  TeacherApprovalDecision,
} from "../types/approvalTypes";

export const approvalServices = {
  getPendingRequests: () =>
    apiRequest<RegistrationRequest[]>("/admin/approval-pengajar"),

  processRequest: (id: number, data: TeacherApprovalDecision) =>
    apiRequest<null>(`/admin/approval-pengajar/${id}`, {
      method: "POST",
      body: data,
    }),
};

export default approvalServices;
