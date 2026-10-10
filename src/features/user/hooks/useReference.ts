"use client";

import { useCallback, useEffect, useState } from "react";
import type { Class, ClassFilterParams, School } from "../types/userTypes";
import { userServices } from "../services/userServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userServices.getSchools();
        if (active) setSchools(res.data ?? []);
      } catch (err) {
        if (active) setError(toErrorMessage(err, "Gagal memuat daftar sekolah"));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { schools, loading, error };
}

export function useClasses(
  filters: ClassFilterParams = {},
  enabled = true,
) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { school_id, teacher_id } = filters;

  const refetch = useCallback(async () => {
    if (!enabled) {
      setClasses([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await userServices.getClasses({
        preload: false,
        ...(school_id !== undefined ? { school_id } : {}),
        ...(teacher_id !== undefined ? { teacher_id } : {}),
      });
      setClasses(res.data ?? []);
    } catch (err) {
      setClasses([]);
      setError(toErrorMessage(err, "Gagal memuat daftar kelas"));
    } finally {
      setLoading(false);
    }
  }, [enabled, school_id, teacher_id]);

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [refetch]);

  return { classes, loading, error, refetch };
}
