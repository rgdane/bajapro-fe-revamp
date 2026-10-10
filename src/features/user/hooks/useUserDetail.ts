"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "../types/userTypes";
import { userServices } from "../services/userServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useUserDetail(id?: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await userServices.getUserById(id, true);
      setUser(res.data);
    } catch (err) {
      setUser(null);
      setError(toErrorMessage(err, "Gagal mengambil detail user"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [refetch]);

  return { user, loading, error, refetch };
}

export default useUserDetail;
