"use client";

import { useCallback, useEffect, useState } from "react";
import type { Course, CreateCourseDTO, UpdateCourseDTO } from "../types/courseTypes";
import { courseServices } from "../services/courseServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useCourseDetail(courseId: number | null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    if (courseId === null) {
      setCourse(null);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await courseServices.getCourseById(courseId);
      setCourse(res.data ?? null);
      return res.data ?? null;
    } catch (err) {
      setCourse(null);
      setError(toErrorMessage(err, "Gagal mengambil detail course"));
      return null;
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void (async () => {
      await loadCourse();
    })();
  }, [loadCourse]);

  const saveCourse = useCallback(
    async (values: CreateCourseDTO): Promise<number> => {
      if (courseId === null) {
        const res = await courseServices.createCourse(values);
        return res.data.id;
      }
      const payload: UpdateCourseDTO = { ...values };
      const res = await courseServices.updateCourse(courseId, payload);
      setCourse(res.data);
      return res.data.id;
    },
    [courseId],
  );

  return { course, loading, error, loadCourse, saveCourse };
}

export default useCourseDetail;
