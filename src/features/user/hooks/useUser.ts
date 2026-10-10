"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  BulkCreateUsersDTO,
  BulkDeleteUsersDTO,
  BulkUpdateUsersDTO,
  CreateUserDTO,
  UpdateUserDTO,
  User,
  UserFilterParams,
} from "../types/userTypes";
import { userServices } from "../services/userServices";

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (params?: UserFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userServices.getUsers({ preload: true, ...params });
      setUsers(res.data ?? []);
      setTotal(res.total ?? res.data?.length ?? 0);
      return res.data ?? [];
    } catch (err) {
      setError(toErrorMessage(err, "Gagal mengambil data user"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userServices.getUsers({ preload: true });
        if (!active) return;
        setUsers(res.data ?? []);
        setTotal(res.total ?? res.data?.length ?? 0);
      } catch (err) {
        if (active) setError(toErrorMessage(err, "Gagal mengambil data user"));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const getUserById = useCallback(
    (id: number, preload = true) => userServices.getUserById(id, preload),
    [],
  );

  const createUser = useCallback(
    async (data: CreateUserDTO) => {
      const res = await userServices.createUser(data);
      await fetchUsers();
      return res.data;
    },
    [fetchUsers],
  );

  const updateUser = useCallback(
    async (id: number, data: UpdateUserDTO) => {
      const res = await userServices.updateUser(id, data);
      await fetchUsers();
      return res.data;
    },
    [fetchUsers],
  );

  const deleteUser = useCallback(
    async (id: number, isPermanent?: boolean) => {
      await userServices.deleteUser(id, isPermanent);
      await fetchUsers();
    },
    [fetchUsers],
  );

  const bulkCreateUsers = useCallback(
    async (data: BulkCreateUsersDTO) => {
      const res = await userServices.bulkCreateUsers(data);
      await fetchUsers();
      return res.data;
    },
    [fetchUsers],
  );

  const bulkUpdateUsers = useCallback(
    async (data: BulkUpdateUsersDTO) => {
      await userServices.bulkUpdateUsers(data);
      await fetchUsers();
    },
    [fetchUsers],
  );

  const bulkDeleteUsers = useCallback(
    async (data: BulkDeleteUsersDTO, isPermanent?: boolean) => {
      await userServices.bulkDeleteUsers(data, isPermanent);
      await fetchUsers();
    },
    [fetchUsers],
  );

  return {
    users,
    total,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    bulkCreateUsers,
    bulkUpdateUsers,
    bulkDeleteUsers,
  };
}

export default useUser;
