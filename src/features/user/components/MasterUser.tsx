"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { App, Button, Form, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { MasterTemplate } from "@/components/templates/MasterTemplate";
import { MasterFormModal } from "@/components/fragments/MasterFormModal";
import { useUser } from "../hooks/useUser";
import { UserFormFields } from "./UserFormFields";
import { UserRoleTag } from "./UserRoleTag";
import type { CreateUserDTO, UpdateUserDTO, User } from "../types/userTypes";

interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  nip?: string | null;
  role: User["role"];
  school_id?: number | null;
  class_id?: number | null;
}

export default function MasterUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = App.useApp();

  const { users, loading, error, getUserById, createUser, updateUser } = useUser();

  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const openEditById = useCallback(
    async (id: number) => {
      try {
        const res = await getUserById(id, true);
        setModalMode("edit");
        setEditing(res.data);
        setModalOpen(true);
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal memuat data user");
      }
    },
    [getUserById, message],
  );

  const openCreate = useCallback(() => {
    setModalMode("create");
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const openEdit = useCallback(
    (record: User) => void openEditById(record.id),
    [openEditById],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  }, [form]);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.code ?? "").toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [search, users]);

  const columns: ColumnsType<User> = useMemo(
    () => [
      {
        title: "Kode",
        dataIndex: "code",
        key: "code",
        render: (val: string | null) => val ?? "—",
      },
      { title: "Nama", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      {
        title: "Role",
        key: "role",
        render: (_, record) => <UserRoleTag role={record.role} />,
      },
      {
        title: "School Name",
        key: "school",
        render: (_, record) => record.school?.school_name ?? "—",
      },
      {
        title: "Aksi",
        key: "action",
        width: 180,
        render: (_, record) => (
          <Space size={0}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/manage-user/user/${record.id}`)}
            >
              Detail
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            >
              Edit
            </Button>
          </Space>
        ),
      },
    ],
    [openEdit, router],
  );

  // Dukungan kembali dari halaman detail: /manage-user/user?edit=<id>
  const handledEditParam = useRef(false);
  useEffect(() => {
    const param = searchParams.get("edit");
    if (!param || handledEditParam.current) return;
    handledEditParam.current = true;
    router.replace("/manage-user/user");
    const id = Number(param);
    if (Number.isFinite(id)) {
      void (async () => {
        await openEditById(id);
      })();
    }
  }, [searchParams, router, openEditById]);

  // Jangan preload password ke form edit; biarkan kosong.
  const editInitialValues = useMemo(
    () =>
      editing
        ? ({ ...editing, password: "" } as unknown as UserFormValues)
        : undefined,
    [editing],
  );

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await createUser(buildCreatePayload(values));
        message.success("User berhasil dibuat");
      } else if (editing) {
        await updateUser(editing.id, buildUpdatePayload(values));
        message.success("User berhasil diperbarui");
      }
      closeModal();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <MasterTemplate<User>
        title="List User"
        subtitle="Kelola pengguna dan relasinya"
        addLabel="Tambah User"
        onAdd={openCreate}
        onSearch={setSearch}
        searchPlaceholder="Cari nama, email, atau kode"
        tableProps={{
          columns,
          dataSource: filtered,
          loading,
        }}
      />

      <MasterFormModal<UserFormValues>
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Tambah User" : "Edit User"}
        form={form}
        initialValues={editInitialValues}
        onCancel={closeModal}
        onSubmit={handleSubmit}
        submitLoading={submitting}
        fields={<UserFormFields form={form} mode={modalMode} />}
      />
    </>
  );
}

function buildCreatePayload(values: UserFormValues): CreateUserDTO {
  const payload: CreateUserDTO = {
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password ?? "",
    role: values.role,
    nip: values.nip?.toString().trim() || null,
  };
  if (values.role !== "admin") payload.school_id = values.school_id ?? null;
  if (values.role === "student") payload.class_id = values.class_id ?? null;
  return payload;
}

function buildUpdatePayload(values: UserFormValues): UpdateUserDTO {
  const payload: UpdateUserDTO = {
    name: values.name.trim(),
    email: values.email.trim(),
    nip: values.nip?.toString().trim() || null,
    role: values.role,
  };
  if (values.password) payload.password = values.password;
  if (values.role !== "admin") payload.school_id = values.school_id ?? null;
  if (values.role === "student") payload.class_id = values.class_id ?? null;
  return payload;
}
