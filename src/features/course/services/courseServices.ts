import { apiRequest } from "@/lib/apiClient";
import type {
  Course,
  CreateCourseDTO,
  CreateLessonDTO,
  CreateMaterialDTO,
  CreateSubLessonDTO,
  Lesson,
  LevelRef,
  Material,
  SubLesson,
  UpdateCourseDTO,
  UpdateLessonDTO,
  UpdateMaterialDTO,
  UpdateSubLessonDTO,
} from "../types/courseTypes";

export const courseServices = {
  // Course
  getCourses: () => apiRequest<Course[]>("/courses"),
  getCourseById: (id: number) => apiRequest<Course>(`/courses/${id}`),
  createCourse: (data: CreateCourseDTO) =>
    apiRequest<Course>("/courses", { method: "POST", body: data }),
  updateCourse: (id: number, data: UpdateCourseDTO) =>
    apiRequest<Course>(`/courses/${id}`, { method: "PUT", body: data }),
  deleteCourse: (id: number) =>
    apiRequest<null>(`/courses/${id}`, { method: "DELETE" }),

  // Level (referensi)
  getLevels: () => apiRequest<LevelRef[]>("/levels"),

  // Lesson
  getLessons: (courseId: number) =>
    apiRequest<Lesson[]>("/lessons", { query: { course_id: courseId } }),
  createLesson: (data: CreateLessonDTO) =>
    apiRequest<Lesson>("/lessons", { method: "POST", body: data }),
  updateLesson: (id: number, data: UpdateLessonDTO) =>
    apiRequest<Lesson>(`/lessons/${id}`, { method: "PUT", body: data }),
  deleteLesson: (id: number) =>
    apiRequest<null>(`/lessons/${id}`, { method: "DELETE" }),

  // Sub Lesson
  getSubLessons: (lessonId: number) =>
    apiRequest<SubLesson[]>("/sub_lessons", { query: { lesson_id: lessonId } }),
  createSubLesson: (data: CreateSubLessonDTO) =>
    apiRequest<SubLesson>("/sub_lessons", { method: "POST", body: data }),
  updateSubLesson: (id: number, data: UpdateSubLessonDTO) =>
    apiRequest<SubLesson>(`/sub_lessons/${id}`, { method: "PUT", body: data }),
  deleteSubLesson: (id: number) =>
    apiRequest<null>(`/sub_lessons/${id}`, { method: "DELETE" }),

  // Material
  getMaterials: (subLessonId: number) =>
    apiRequest<Material[]>("/materials", {
      query: { sub_lesson_id: subLessonId },
    }),
  createMaterial: (data: CreateMaterialDTO) =>
    apiRequest<Material>("/materials", { method: "POST", body: data }),
  updateMaterial: (id: number, data: UpdateMaterialDTO) =>
    apiRequest<Material>(`/materials/${id}`, { method: "PUT", body: data }),
  deleteMaterial: (id: number) =>
    apiRequest<null>(`/materials/${id}`, { method: "DELETE" }),
};

export default courseServices;
