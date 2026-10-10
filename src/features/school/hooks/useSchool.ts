"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreateSchoolDTO,
  School,
  UpdateSchoolDTO,
} from "../types/schoolTypes";
import { schoolServices } from "../services/schoolServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useSchool() {
  const [schools, setSchools] = useState<School[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await schoolServices.getSchools();
      setSchools(res.data ?? []);
      setTotal(res.total ?? res.data?.length ?? 0);
      return res.data ?? [];
    } catch (err) {
      setError(toErrorMessage(err, "Gagal mengambil data sekolah"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchSchools();
    })();
  }, [fetchSchools]);

  const createSchool = useCallback(
    async (data: CreateSchoolDTO) => {
      const res = await schoolServices.createSchool(data);
      await fetchSchools();
      return res.data;
    },
    [fetchSchools],
  );

  const updateSchool = useCallback(
    async (id: number, data: UpdateSchoolDTO) => {
      const res = await schoolServices.updateSchool(id, data);
      await fetchSchools();
      return res.data;
    },
    [fetchSchools],
  );

  const deleteSchool = useCallback(
    async (id: number) => {
      await schoolServices.deleteSchool(id);
      await fetchSchools();
    },
    [fetchSchools],
  );

  return {
    schools,
    total,
    loading,
    error,
    fetchSchools,
    createSchool,
    updateSchool,
    deleteSchool,
  };
}

export default useSchool;
