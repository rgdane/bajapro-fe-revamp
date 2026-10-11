// Types mapped to the BAJAPRO Go Fiber backend contract
// (`/api/v1/admin/approval-pengajar`).

export interface ApprovalSchoolRef {
  id: number;
  school_name: string;
}

export interface ApprovalRequestSchool {
  id: number;
  registration_request_id: number;
  existing_school_id: number | null;
  proposed_school_name: string | null;
  status: string;
  existing_school?: ApprovalSchoolRef | null;
}

export interface RegistrationRequest {
  id: number;
  name: string;
  email: string;
  nip: string | null;
  status: string;
  reviewed_by: number | null;
  rejection_note: string | null;
  created_at: string;
  updated_at: string;
  school?: ApprovalRequestSchool | null;
}

export interface TeacherApprovalDecision {
  action: "approve" | "reject";
  rejection_note?: string | null;
}
