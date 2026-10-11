"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { App, Form, Input, Popconfirm, Space, Switch, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { MasterTemplate } from "@/components/templates/MasterTemplate";
import { MasterFormModal } from "@/components/fragments/MasterFormModal";
import { Button } from "@/components/ui/Button";
import { useLevel } from "../hooks/useLevel";
import type { CreateLevelDTO, Level, UpdateLevelDTO } from "../types/levelTypes";

interface LevelFormValues {
  level_name: string;
  description?: string;
  isactive: boolean;
}

export default function MasterLevel() {
  const { message } = App.useApp();
  const { levels, loading, error, createLevel, updateLevel, deleteLevel } =
    useLevel();

  const [form] = Form.useForm<LevelFormValues>();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Level | null>(null);
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

  const openEdit = useCallback((record: Level) => {
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
    async (record: Level) => {
      try {
        await deleteLevel(record.id);
        message.success("Level berhasil dihapus");
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal menghapus");
      }
    },
    [deleteLevel, message],
  );

  const filtered = useMemo(() => {
    if (!search) return levels;
    const q = search.toLowerCase();
    return levels.filter(
      (l) =>
        l.level_name.toLowerCase().includes(q) ||
        (l.description ?? "").toLowerCase().includes(q),
    );
  }, [search, levels]);

  const columns: ColumnsType<Level> = useMemo(
    () => [
      { title: "Nama Level", dataIndex: "level_name", key: "level_name" },
      {
        title: "Deskripsi",
        dataIndex: "description",
        key: "description",
        render: (val: string) => val || "—",
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
              title="Hapus level ini?"
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

  const handleSubmit = async (values: LevelFormValues) => {
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await createLevel(buildCreatePayload(values));
        message.success("Level berhasil dibuat");
      } else if (editing) {
        await updateLevel(editing.id, buildUpdatePayload(values));
        message.success("Level berhasil diperbarui");
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
      <MasterTemplate<Level>
        title="List Level"
        subtitle="Kelola daftar level pembelajaran"
        addLabel="Tambah Level"
        onAdd={openCreate}
        onSearch={setSearch}
        searchPlaceholder="Cari nama level"
        tableProps={{
          columns,
          dataSource: filtered,
          loading,
        }}
      />

      <MasterFormModal<LevelFormValues>
        open={modalOpen}
        mode={modalMode}
        title={modalMode === "create" ? "Tambah Level" : "Edit Level"}
        form={form}
        initialValues={editInitialValues}
        onCancel={closeModal}
        onSubmit={handleSubmit}
        submitLoading={submitting}
        fields={
          <>
            <Form.Item
              label="Nama Level"
              name="level_name"
              rules={[{ required: true, message: "Nama level wajib diisi" }]}
            >
              <Input placeholder="Contoh: Easy" maxLength={50} />
            </Form.Item>
            <Form.Item label="Deskripsi" name="description">
              <Input.TextArea
                rows={3}
                placeholder="Deskripsi level (opsional)"
              />
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

function buildCreatePayload(values: LevelFormValues): CreateLevelDTO {
  return {
    level_name: values.level_name.trim(),
    description: values.description?.trim() ?? "",
  };
}

function buildUpdatePayload(values: LevelFormValues): UpdateLevelDTO {
  return {
    level_name: values.level_name.trim(),
    description: values.description?.trim() ?? "",
    isactive: values.isactive,
  };
}
