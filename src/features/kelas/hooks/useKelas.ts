"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreateKelasDTO,
  Kelas,
  TeacherRef,
  UpdateKelasDTO,
} from "../types/kelasTypes";
import { kelasServices } from "../services/kelasServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useKelas() {
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await kelasServices.getClasses({ preload: true });
      setClasses(res.data ?? []);
      setTotal(res.total ?? res.data?.length ?? 0);
      return res.data ?? [];
    } catch (err) {
      setError(toErrorMessage(err, "Gagal mengambil data kelas"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchClasses();
    })();
  }, [fetchClasses]);

  const createClass = useCallback(
    async (data: CreateKelasDTO) => {
      const res = await kelasServices.createClass(data);
      await fetchClasses();
      return res.data;
    },
    [fetchClasses],
  );

  const updateClass = useCallback(
    async (id: number, data: UpdateKelasDTO) => {
      const res = await kelasServices.updateClass(id, data);
      await fetchClasses();
      return res.data;
    },
    [fetchClasses],
  );

  const deleteClass = useCallback(
    async (id: number) => {
      await kelasServices.deleteClass(id);
      await fetchClasses();
    },
    [fetchClasses],
  );

  return {
    classes,
    total,
    loading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
  };
}

export function useTeachers() {
  const [teachers, setTeachers] = useState<TeacherRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await kelasServices.getTeachers();
        if (active) setTeachers(res.data ?? []);
      } catch (err) {
        if (active) setError(toErrorMessage(err, "Gagal memuat daftar teacher"));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { teachers, loading, error };
}

export default useKelas;
