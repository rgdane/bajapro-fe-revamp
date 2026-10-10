"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { App, Form, Input, Popconfirm, Space, Switch, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { MasterTemplate } from "@/components/templates/MasterTemplate";
import { MasterFormModal } from "@/components/fragments/MasterFormModal";
import { Button } from "@/components/ui/Button";
import { useSchool } from "../hooks/useSchool";
import type {
  CreateSchoolDTO,
  School,
  UpdateSchoolDTO,
} from "../types/schoolTypes";

interface SchoolFormValues {
  school_name: string;
  isactive: boolean;
}

export default function MasterSchool() {
  const { message } = App.useApp();
  const { schools, loading, error, createSchool, updateSchool, deleteSchool } =
    useSchool();

  const [form] = Form.useForm<SchoolFormValues>();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<School | null>(null);
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

  const openEdit = useCallback(
    (record: School) => {
      setModalMode("edit");
      setEditing(record);
      setModalOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  }, [form]);

  const handleDelete = useCallback(
    async (record: School) => {
      try {
        await deleteSchool(record.id);
        message.success("Sekolah berhasil dihapus");
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal menghapus");
      }
    },
    [deleteSchool, message],
  );

  const filtered = useMemo(() => {
    if (!search) return schools;
    const q = search.toLowerCase();
    return schools.filter((s) => s.school_name.toLowerCase().includes(q));
  }, [search, schools]);

  const columns: ColumnsType<School> = useMemo(
    () => [
      { title: "Nama Sekolah", dataIndex: "school_name", key: "school_name" },
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
              title="Hapus sekolah ini?"
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

  const handleSubmit = async (values: SchoolFormValues) => {
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await createSchool(buildCreatePayload(values));
        message.success("Sekolah berhasil dibuat");
      } else if (editing) {
        await updateSchool(editing.id, buildUpdatePayload(values));
        message.success("Sekolah berhasil diperbarui");
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
      <MasterTemplate<School>
        title="List Sekolah"
        subtitle="Kelola daftar sekolah"
        addLabel="Tambah Sekolah"
        onAdd={openCreate}
        onSearch={setSearch}
        searchPlaceholder="Cari nama sekolah"
        tableProps={{
          columns,
          dataSource: filtered,
          loading,
        }}
      />

      <MasterFormModal<SchoolFormValues>
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Tambah Sekolah" : "Edit Sekolah"}
        form={form}
        initialValues={editInitialValues}
        onCancel={closeModal}
        onSubmit={handleSubmit}
        submitLoading={submitting}
        fields={
          <>
            <Form.Item
              label="Nama Sekolah"
              name="school_name"
              rules={[{ required: true, message: "Nama sekolah wajib diisi" }]}
            >
              <Input placeholder="Contoh: SMK Negeri 1 Jakarta" />
            </Form.Item>
            <Form.Item
              label="Status Aktif"
              name="isactive"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Aktif" unCheckedChildren="Nonaktif" />
            </Form.Item>
          </>
        }
      />
    </>
  );
}

function buildCreatePayload(values: SchoolFormValues): CreateSchoolDTO {
  return {
    school_name: values.school_name.trim(),
    isactive: values.isactive ?? true,
  };
}

function buildUpdatePayload(values: SchoolFormValues): UpdateSchoolDTO {
  return {
    school_name: values.school_name.trim(),
    isactive: values.isactive,
  };
}
