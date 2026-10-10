// Types mapped to the BAJAPRO Go Fiber backend contract (`/api/v1/school`).

export interface School {
  id: number;
  school_name: string;
  isactive: boolean;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface CreateSchoolDTO {
  school_name: string;
  isactive?: boolean;
}

export interface UpdateSchoolDTO {
  school_name?: string;
  isactive?: boolean;
}

export interface SchoolFilterParams {
  name?: string;
  preload?: boolean;
}
