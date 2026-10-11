"use client";

import { useCallback, useEffect, useState } from "react";
import type { RegistrationRequest } from "../types/approvalTypes";
import { approvalServices } from "../services/approvalServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useApproval() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await approvalServices.getPendingRequests();
      setRequests(res.data ?? []);
      return res.data ?? [];
    } catch (err) {
      setError(toErrorMessage(err, "Gagal mengambil data permohonan"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchRequests();
    })();
  }, [fetchRequests]);

  const approve = useCallback(
    async (id: number) => {
      await approvalServices.processRequest(id, { action: "approve" });
      await fetchRequests();
    },
    [fetchRequests],
  );

  const reject = useCallback(
    async (id: number, note: string) => {
      await approvalServices.processRequest(id, {
        action: "reject",
        rejection_note: note,
      });
      await fetchRequests();
    },
    [fetchRequests],
  );

  return { requests, loading, error, fetchRequests, approve, reject };
}

export default useApproval;
