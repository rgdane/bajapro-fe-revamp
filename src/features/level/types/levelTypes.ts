// Types mapped to the BAJAPRO Go Fiber backend contract (`/api/v1/levels`).

export interface Level {
  id: number;
  level_name: string;
  description: string;
  isactive: boolean;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface CreateLevelDTO {
  level_name: string;
  description?: string;
}

export interface UpdateLevelDTO {
  level_name?: string;
  description?: string;
  isactive?: boolean;
}

export interface LevelFilterParams {
  preload?: boolean;
}
