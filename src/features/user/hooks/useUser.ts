"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  ApiResponse,
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

  const load = useCallback(
    (params?: UserFilterParams) => userServices.getUsers(params),
    [],
  );

  const applyUsers = useCallback((res: ApiResponse<User[]>) => {
    setUsers(res.data);
    setTotal(res.total ?? res.data.length);
  }, []);

  useEffect(() => {
    let isActive = true;
    load()
      .then((res) => {
        if (isActive) applyUsers(res);
      })
      .catch((err) => {
        if (isActive) setError(toErrorMessage(err, "Gagal mengambil data user"));
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [load, applyUsers]);

  const fetchUsers = useCallback(
    async (params?: UserFilterParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await load(params);
        applyUsers(res);
      } catch (err) {
        setError(toErrorMessage(err, "Gagal mengambil data user"));
      } finally {
        setLoading(false);
      }
    },
    [load, applyUsers],
  );

  const wrap = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn();
        await fetchUsers();
        return result;
      } catch (err) {
        setError(toErrorMessage(err, "Terjadi kesalahan"));
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers],
  );

  const fetchUserById = useCallback(
    (id: number, preload?: boolean) => userServices.getUserById(id, preload),
    [],
  );

  const createUser = useCallback((data: CreateUserDTO) => wrap(() => userServices.createUser(data)), [wrap]);

  const updateUser = useCallback((id: number, data: UpdateUserDTO) => wrap(() => userServices.updateUser(id, data)), [wrap]);

  const deleteUser = useCallback((id: number, isPermanent?: boolean) => wrap(() => userServices.deleteUser(id, isPermanent)), [wrap]);

  const bulkCreateUsers = useCallback((data: BulkCreateUsersDTO) => wrap(() => userServices.bulkCreateUsers(data)), [wrap]);

  const bulkUpdateUsers = useCallback((data: BulkUpdateUsersDTO) => wrap(() => userServices.bulkUpdateUsers(data)), [wrap]);

  const bulkDeleteUsers = useCallback((data: BulkDeleteUsersDTO, isPermanent?: boolean) => wrap(() => userServices.bulkDeleteUsers(data, isPermanent)), [wrap]);

  return {
    users,
    total,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    bulkCreateUsers,
    bulkUpdateUsers,
    bulkDeleteUsers,
  };
}

export default useUser;