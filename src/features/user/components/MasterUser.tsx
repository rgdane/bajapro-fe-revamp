"use client";

import React, { useMemo, useState } from "react";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import { MasterTemplate } from "@/components/templates/MasterTemplate";
import { useUser } from "../hooks/useUser";
import type { User } from "../types/userTypes";

const APPROVAL_META: Record<number, { label: string; color: string }> = {
  0: { label: "Pending", color: "gold" },
  1: { label: "Disetujui", color: "green" },
  2: { label: "Ditolak", color: "red" },
};

export default function MasterUser() {
  const router = useRouter();
  const { users, loading } = useUser();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => {
      const role = u.has_roles?.map((r) => r.name).join(" ").toLowerCase() ?? "";
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.code ?? "").toLowerCase().includes(q) ||
        role.includes(q)
      );
    });
  }, [search, users]);

  const columns: ColumnsType<User> = useMemo(
    () => [
      {
        title: "Kode",
        dataIndex: "code",
        key: "code",
        render: (val: string | null) => val ?? "-",
      },
      { title: "Nama", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      {
        title: "Role",
        key: "has_roles",
        render: (_, record) =>
          record.has_roles?.length
            ? record.has_roles.map((r) => <Tag key={r.id} color="geekblue">{r.name}</Tag>)
            : "-",
      },
      {
        title: "Approval",
        dataIndex: "approval",
        key: "approval",
        render: (val: number) => {
          const meta = APPROVAL_META[val] ?? { label: String(val), color: "default" };
          return <Tag color={meta.color}>{meta.label}</Tag>;
        },
      },
      {
        title: "Status",
        dataIndex: "isactive",
        key: "isactive",
        render: (val: boolean) => (
          <Tag color={val ? "green" : "red"}>{val ? "Active" : "Inactive"}</Tag>
        ),
      },
      {
        title: "Kelas",
        key: "class",
        render: (_, record) => record.class?.class_name ?? "-",
      },
    ],
    [],
  );

  return (
    <MasterTemplate
      title="List User"
      subtitle="Kelola pengguna dan profilnya"
      addLabel="Tambah User"
      onAdd={() => router.push("/master/user/create")}
      onSearch={setSearch}
      searchPlaceholder="Cari Nama"
      tableProps={{
        columns,
        dataSource: filtered,
        loading,
      }}
    />
  );
}