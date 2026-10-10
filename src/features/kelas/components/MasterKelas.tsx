"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { App, Form, Popconfirm, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { MasterTemplate } from "@/components/templates/MasterTemplate";
import { MasterFormModal } from "@/components/fragments/MasterFormModal";
import { Button } from "@/components/ui/Button";
import { useKelas } from "../hooks/useKelas";
import { KelasFormFields } from "./KelasFormFields";
import type {
  CreateKelasDTO,
  Kelas,
  UpdateKelasDTO,
} from "../types/kelasTypes";

interface KelasFormValues {
  class_name: string;
  class_code: string;
  school_id: number;
  teacher_id?: number | null;
  isactive: boolean;
}

export default function MasterKelas() {
  const { message } = App.useApp();
  const { classes, loading, error, createClass, updateClass, deleteClass } =
    useKelas();

  const [form] = Form.useForm<KelasFormValues>();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Kelas | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const openCreate = useCallback(() => {
    setModalMode("create");
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const openEdit = useCallback((record: Kelas) => {
    setModalMode("edit");
    setEditing(record);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  }, [form]);

  const handleDelete = useCallback(
    async (record: Kelas) => {
      try {
        await deleteClass(record.id);
        message.success("Kelas berhasil dihapus");
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal menghapus");
      }
    },
    [deleteClass, message],
  );

  const filtered = useMemo(() => {
    if (!search) return classes;
    const q = search.toLowerCase();
    return classes.filter(
      (c) =>
        c.class_name.toLowerCase().includes(q) ||
        c.class_code.toLowerCase().includes(q) ||
        (c.school?.school_name ?? "").toLowerCase().includes(q),
    );
  }, [search, classes]);

  const columns: ColumnsType<Kelas> = useMemo(
    () => [
      { title: "Nama Kelas", dataIndex: "class_name", key: "class_name" },
      { title: "Kode", dataIndex: "class_code", key: "class_code" },
      {
        title: "Sekolah",
        key: "school",
        render: (_, record) => record.school?.school_name ?? "—",
      },
      {
        title: "Wali Kelas",
        key: "teacher",
        render: (_, record) => record.teacher?.name ?? "—",
      },
      {
        title: "Status",
        key: "isactive",
        render: (_, record) =>
          record.isactive ? (
            <Tag color="green">Aktif</Tag>
          ) : (
            <Tag color="red">Nonaktif</Tag>
          ),
      },
      {
        title: "Aksi",
        key: "action",
        width: 180,
        render: (_, record) => (
          <Space size={0}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Hapus kelas ini?"
              okText="Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record)}
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Hapus
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete, openEdit],
  );

  const editInitialValues = useMemo(
    () => (editing ? { ...editing } : undefined),
    [editing],
  );

  const handleSubmit = async (values: KelasFormValues) => {
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await createClass(buildCreatePayload(values));
        message.success("Kelas berhasil dibuat");
      } else if (editing) {
        await updateClass(editing.id, buildUpdatePayload(values));
        message.success("Kelas berhasil diperbarui");
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
      <MasterTemplate<Kelas>
        title="List Kelas"
        subtitle="Kelola daftar kelas"
        addLabel="Tambah Kelas"
        onAdd={openCreate}
        onSearch={setSearch}
        searchPlaceholder="Cari nama, kode, atau sekolah"
        tableProps={{
          columns,
          dataSource: filtered,
          loading,
        }}
      />

      <MasterFormModal<KelasFormValues>
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Tambah Kelas" : "Edit Kelas"}
        form={form}
        initialValues={editInitialValues}
        onCancel={closeModal}
        onSubmit={handleSubmit}
        submitLoading={submitting}
        fields={<KelasFormFields />}
      />
    </>
  );
}

function buildCreatePayload(values: KelasFormValues): CreateKelasDTO {
  return {
    class_name: values.class_name.trim(),
    class_code: values.class_code.trim(),
    school_id: values.school_id,
    teacher_id: values.teacher_id ?? null,
  };
}

function buildUpdatePayload(values: KelasFormValues): UpdateKelasDTO {
  return {
    class_name: values.class_name.trim(),
    class_code: values.class_code.trim(),
    school_id: values.school_id,
    teacher_id: values.teacher_id ?? null,
    isactive: values.isactive,
  };
}
