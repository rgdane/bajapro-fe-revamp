"use client";

import { useCallback, useEffect, useState } from "react";
import type { Course } from "../types/courseTypes";
import { courseServices } from "../services/courseServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useCourse() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseServices.getCourses();
      setCourses(res.data ?? []);
      return res.data ?? [];
    } catch (err) {
      setError(toErrorMessage(err, "Gagal mengambil data course"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchCourses();
    })();
  }, [fetchCourses]);

  const deleteCourse = useCallback(
    async (id: number) => {
      // Hard delete tanpa cascade -> cegah hapus course yang masih punya lesson.
      const lessons = await courseServices.getLessons(id);
      if ((lessons.data ?? []).length > 0) {
        throw new Error(
          "Course masih memiliki lesson. Hapus semua lesson-nya terlebih dahulu.",
        );
      }
      await courseServices.deleteCourse(id);
      await fetchCourses();
    },
    [fetchCourses],
  );

  return { courses, loading, error, fetchCourses, deleteCourse };
}

export default useCourse;
