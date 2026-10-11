"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  CreateLevelDTO,
  Level,
  UpdateLevelDTO,
} from "../types/levelTypes";
import { levelServices } from "../services/levelServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useLevel() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await levelServices.getLevels();
      setLevels(res.data ?? []);
      return res.data ?? [];
    } catch (err) {
      setError(toErrorMessage(err, "Gagal mengambil data level"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchLevels();
    })();
  }, [fetchLevels]);

  const createLevel = useCallback(
    async (data: CreateLevelDTO) => {
      const res = await levelServices.createLevel(data);
      await fetchLevels();
      return res.data;
    },
    [fetchLevels],
  );

  const updateLevel = useCallback(
    async (id: number, data: UpdateLevelDTO) => {
      const res = await levelServices.updateLevel(id, data);
      await fetchLevels();
      return res.data;
    },
    [fetchLevels],
  );

  const deleteLevel = useCallback(
    async (id: number) => {
      await levelServices.deleteLevel(id);
      await fetchLevels();
    },
    [fetchLevels],
  );

  return {
    levels,
    loading,
    error,
    fetchLevels,
    createLevel,
    updateLevel,
    deleteLevel,
  };
}

export default useLevel;
