// Types mapped to the BAJAPRO Go Fiber backend contract.
// Course → Lesson → Sub Lesson → Material (+ Level pada Lesson).

export interface Course {
  id: number;
  course_name: string;
  description: string;
  img_thumbnail: string;
  published: boolean;
  isactive: boolean;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  // Preloaded/agregat dari GET /courses.
  lessonCount?: number;
  subLessonCount?: number;
}

export interface Lesson {
  id: number;
  course_id: number;
  level_id: number;
  title: string;
  description: string;
  position: number;
  img_thumbnail: string;
  published: boolean;
  isactive: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface SubLesson {
  id: number;
  lesson_id: number;
  title: string;
  order_position: number;
  isactive: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Material {
  id: number;
  sub_lesson_id: number;
  title: string;
  materials: string;
  url_video: string;
  content_position: number;
  prompt_llm: string;
  published: boolean;
  isactive: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface LevelRef {
  id: number;
  level_name: string;
  description: string;
  isactive: boolean;
}

export interface CreateCourseDTO {
  course_name: string;
  description: string;
  img_thumbnail: string;
}

export interface UpdateCourseDTO {
  course_name?: string;
  description?: string;
  img_thumbnail?: string;
  published?: boolean;
  isactive?: boolean;
}

export interface CreateLessonDTO {
  course_id: number;
  level_id: number;
  title: string;
  description: string;
  position: number;
  img_thumbnail: string;
}

export interface UpdateLessonDTO {
  course_id?: number;
  level_id?: number;
  title?: string;
  description?: string;
  position?: number;
  img_thumbnail?: string;
  published?: boolean;
  isactive?: boolean;
}

export interface CreateSubLessonDTO {
  lesson_id: number;
  title: string;
  order_position: number;
}

export interface UpdateSubLessonDTO {
  lesson_id?: number;
  title?: string;
  order_position?: number;
  isactive?: boolean;
}

export interface CreateMaterialDTO {
  sub_lesson_id: number;
  title: string;
  materials: string;
  url_video: string;
  content_position: number;
  prompt_llm: string;
}

export interface UpdateMaterialDTO {
  sub_lesson_id?: number;
  title?: string;
  materials?: string;
  url_video?: string;
  content_position?: number;
  prompt_llm?: string;
  published?: boolean;
  isactive?: boolean;
}
