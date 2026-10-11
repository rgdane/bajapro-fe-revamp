"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  App,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/Button";
import { courseServices } from "../services/courseServices";
import type { CreateLessonDTO, Lesson, LevelRef } from "../types/courseTypes";

const { Text, Paragraph } = Typography;

interface LessonFormValues {
  level_id: number;
  title: string;
  description?: string;
}

export interface LessonTabProps {
  courseId: number;
}

export function LessonTab({ courseId }: LessonTabProps) {
  const { message } = App.useApp();

  const [levels, setLevels] = useState<LevelRef[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form] = Form.useForm<LessonFormValues>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const loadLevels = useCallback(async () => {
    try {
      const res = await courseServices.getLevels();
      return (res.data ?? []).filter((l) => l.isactive);
    } catch {
      return [] as LevelRef[];
    }
  }, []);

  const loadLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseServices.getLessons(courseId);
      setLessons(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat lesson");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void (async () => {
      setLevels(await loadLevels());
      await loadLessons();
    })();
  }, [loadLevels, loadLessons]);

  const openCreate = useCallback(
    (levelId?: number) => {
      setModalMode("create");
      setEditing(null);
      form.resetFields();
      if (levelId !== undefined) form.setFieldValue("level_id", levelId);
      setModalOpen(true);
    },
    [form],
  );

  const openEdit = useCallback((record: Lesson) => {
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
    async (record: Lesson) => {
      try {
        const subs = await courseServices.getSubLessons(record.id);
        if ((subs.data ?? []).length > 0) {
          message.error(
            "Lesson masih memiliki sub lesson. Hapus sub lesson-nya dulu.",
          );
          return;
        }
        await courseServices.deleteLesson(record.id);
        message.success("Lesson berhasil dihapus");
        await loadLessons();
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal menghapus");
      }
    },
    [loadLessons, message],
  );

  const handleSubmit = async (values: LessonFormValues) => {
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        const position =
          lessons.filter((l) => l.level_id === values.level_id).length + 1;
        const payload: CreateLessonDTO = {
          course_id: courseId,
          level_id: values.level_id,
          title: values.title.trim(),
          description: (values.description ?? "").trim(),
          position,
          img_thumbnail: "",
        };
        await courseServices.createLesson(payload);
        message.success("Lesson berhasil dibuat");
      } else if (editing) {
        await courseServices.updateLesson(editing.id, {
          level_id: values.level_id,
          title: values.title.trim(),
          description: (values.description ?? "").trim(),
        });
        message.success("Lesson berhasil diperbarui");
      }
      closeModal();
      await loadLessons();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const levelOptions = useMemo(
    () => levels.map((l) => ({ label: l.level_name, value: l.id })),
    [levels],
  );

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        {levels.length === 0 ? (
          <Empty description="Belum ada level aktif" />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {levels.map((level) => {
              const items = lessons
                .filter((l) => l.level_id === level.id)
                .sort((a, b) => a.position - b.position);
              return (
                <Card
                  key={level.id}
                  loading={loading}
                  style={{ borderRadius: 8 }}
                  title={
                    <Space>
                      <Tag color="cyan">{`Level: ${level.level_name}`}</Tag>
                    </Space>
                  }
                  extra={
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() => openCreate(level.id)}
                    >
                      Tambah
                    </Button>
                  }
                >
                  {items.length === 0 ? (
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                      Belum ada lesson.
                    </Paragraph>
                  ) : (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {items.map((lesson) => (
                        <div
                          key={lesson.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                            borderBottom: "1px solid #f0f0f0",
                            paddingBottom: 8,
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <Text strong>{lesson.title}</Text>
                            {lesson.description ? (
                              <Paragraph
                                type="secondary"
                                style={{ marginBottom: 0, fontSize: 12 }}
                                ellipsis
                              >
                                {lesson.description}
                              </Paragraph>
                            ) : null}
                          </div>
                          <Space size={0}>
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => openEdit(lesson)}
                            />
                            <Popconfirm
                              title="Hapus lesson ini?"
                              okText="Hapus"
                              cancelText="Batal"
                              okButtonProps={{ danger: true }}
                              onConfirm={() => handleDelete(lesson)}
                            >
                              <Button type="link" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                          </Space>
                        </div>
                      ))}
                    </Space>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Space>

      <Modal
        open={modalOpen}
        title={modalMode === "create" ? "Tambah Lesson" : "Edit Lesson"}
        okText="Simpan"
        cancelText="Batal"
        confirmLoading={submitting}
        onCancel={closeModal}
        onOk={() => form.submit()}
        afterClose={() => form.resetFields()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Level"
            name="level_id"
            rules={[{ required: true, message: "Level wajib dipilih" }]}
          >
            <Select
              placeholder="Pilih level"
              options={levelOptions}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            label="Judul Lesson"
            name="title"
            rules={[{ required: true, message: "Judul lesson wajib diisi" }]}
          >
            <Input placeholder="Contoh: Pengenalan Variabel" />
          </Form.Item>
          <Form.Item label="Deskripsi" name="description">
            <Input.TextArea rows={3} placeholder="Deskripsi (opsional)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default LessonTab;
