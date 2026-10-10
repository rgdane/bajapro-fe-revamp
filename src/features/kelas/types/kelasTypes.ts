// Types mapped to the BAJAPRO Go Fiber backend contract (`/api/v1/class`).

export interface SchoolRef {
  id: number;
  school_name: string;
}

export interface TeacherRef {
  id: number;
  name: string;
  email: string;
}

export interface Kelas {
  id: number;
  school_id: number;
  teacher_id: number | null;
  class_name: string;
  class_code: string;
  isactive: boolean;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  // Preloaded relations (backend `?preload=true`).
  school?: SchoolRef | null;
  teacher?: TeacherRef | null;
}

export interface CreateKelasDTO {
  class_name: string;
  class_code: string;
  school_id: number;
  teacher_id?: number | null;
}

export interface UpdateKelasDTO {
  class_name?: string;
  class_code?: string;
  school_id?: number;
  teacher_id?: number | null;
  isactive?: boolean;
}

export interface KelasFilterParams {
  school_id?: number;
  teacher_id?: number;
  preload?: boolean;
}
