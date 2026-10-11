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
  Segmented,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/Button";
import { courseServices } from "../services/courseServices";
import type {
  CreateMaterialDTO,
  Lesson,
  Material,
  SubLesson,
} from "../types/courseTypes";

const { Text, Paragraph } = Typography;

interface SubLessonFormValues {
  title: string;
}

interface MaterialFormValues {
  title: string;
  contentType: "text" | "video";
  materials?: string;
  url_video?: string;
}

export interface SubLessonMaterialTabProps {
  courseId: number;
}

export function SubLessonMaterialTab({ courseId }: SubLessonMaterialTabProps) {
  const { message } = App.useApp();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const [subLessons, setSubLessons] = useState<SubLesson[]>([]);
  const [selectedSubLessonId, setSelectedSubLessonId] = useState<number | null>(
    null,
  );
  const [materials, setMaterials] = useState<Material[]>([]);

  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingMat, setLoadingMat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [subForm] = Form.useForm<SubLessonFormValues>();
  const [matForm] = Form.useForm<MaterialFormValues>();

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subModalMode, setSubModalMode] = useState<"create" | "edit">("create");
  const [editingSub, setEditingSub] = useState<SubLesson | null>(null);

  const [matModalOpen, setMatModalOpen] = useState(false);
  const [matModalMode, setMatModalMode] = useState<"create" | "edit">("create");
  const [editingMat, setEditingMat] = useState<Material | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const matContentType = Form.useWatch<"text" | "video">("contentType", matForm);

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const loadLessons = useCallback(async () => {
    try {
      const res = await courseServices.getLessons(courseId);
      setLessons(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat lesson");
    }
  }, [courseId]);

  const loadSubLessons = useCallback(async (lessonId: number) => {
    setLoadingSub(true);
    try {
      const res = await courseServices.getSubLessons(lessonId);
      setSubLessons(
        (res.data ?? []).sort((a, b) => a.order_position - b.order_position),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat sub lesson");
    } finally {
      setLoadingSub(false);
    }
  }, []);

  const loadMaterials = useCallback(async (subLessonId: number) => {
    setLoadingMat(true);
    try {
      const res = await courseServices.getMaterials(subLessonId);
      setMaterials(
        (res.data ?? []).sort((a, b) => a.content_position - b.content_position),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat material");
    } finally {
      setLoadingMat(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await loadLessons();
    })();
  }, [loadLessons]);

  const handleSelectLesson = useCallback(
    async (lessonId: number) => {
      setSelectedLessonId(lessonId);
      setSelectedSubLessonId(null);
      setMaterials([]);
      await loadSubLessons(lessonId);
    },
    [loadSubLessons],
  );

  const handleSelectSubLesson = useCallback(
    async (subId: number) => {
      setSelectedSubLessonId(subId);
      await loadMaterials(subId);
    },
    [loadMaterials],
  );

  // --- Sub Lesson CRUD ---
  const openSubCreate = useCallback(() => {
    setSubModalMode("create");
    setEditingSub(null);
    subForm.resetFields();
    setSubModalOpen(true);
  }, [subForm]);

  const openSubEdit = useCallback(
    (record: SubLesson) => {
      setSubModalMode("edit");
      setEditingSub(record);
      subForm.setFieldsValue({ title: record.title });
      setSubModalOpen(true);
    },
    [subForm],
  );

  const closeSubModal = useCallback(() => {
    setSubModalOpen(false);
    setEditingSub(null);
    subForm.resetFields();
  }, [subForm]);

  const handleSubSubmit = async (values: SubLessonFormValues) => {
    if (selectedLessonId === null) return;
    setSubmitting(true);
    try {
      if (subModalMode === "create") {
        await courseServices.createSubLesson({
          lesson_id: selectedLessonId,
          title: values.title.trim(),
          order_position: subLessons.length + 1,
        });
        message.success("Sub lesson berhasil dibuat");
      } else if (editingSub) {
        await courseServices.updateSubLesson(editingSub.id, {
          title: values.title.trim(),
        });
        message.success("Sub lesson berhasil diperbarui");
      }
      closeSubModal();
      await loadSubLessons(selectedLessonId);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubDelete = useCallback(
    async (record: SubLesson) => {
      try {
        const mats = await courseServices.getMaterials(record.id);
        if ((mats.data ?? []).length > 0) {
          message.error(
            "Sub lesson masih memiliki material. Hapus material-nya dulu.",
          );
          return;
        }
        await courseServices.deleteSubLesson(record.id);
        message.success("Sub lesson berhasil dihapus");
        if (selectedLessonId !== null) await loadSubLessons(selectedLessonId);
        if (selectedSubLessonId === record.id) {
          setSelectedSubLessonId(null);
          setMaterials([]);
        }
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal menghapus");
      }
    },
    [loadSubLessons, message, selectedLessonId, selectedSubLessonId],
  );

  // --- Material CRUD ---
  const openMatCreate = useCallback(() => {
    setMatModalMode("create");
    setEditingMat(null);
    matForm.resetFields();
    matForm.setFieldsValue({ contentType: "text" });
    setMatModalOpen(true);
  }, [matForm]);

  const openMatEdit = useCallback(
    (record: Material) => {
      setMatModalMode("edit");
      setEditingMat(record);
      matForm.setFieldsValue({
        title: record.title,
        contentType: record.url_video ? "video" : "text",
        materials: record.materials,
        url_video: record.url_video,
      });
      setMatModalOpen(true);
    },
    [matForm],
  );

  const closeMatModal = useCallback(() => {
    setMatModalOpen(false);
    setEditingMat(null);
    matForm.resetFields();
  }, [matForm]);

  const handleMatSubmit = async (values: MaterialFormValues) => {
    if (selectedSubLessonId === null) return;
    setSubmitting(true);
    const isVideo = values.contentType === "video";
    try {
      if (matModalMode === "create") {
        const payload: CreateMaterialDTO = {
          sub_lesson_id: selectedSubLessonId,
          title: values.title.trim(),
          materials: isVideo ? "" : (values.materials ?? "").trim(),
          url_video: isVideo ? (values.url_video ?? "").trim() : "",
          content_position: materials.length + 1,
          prompt_llm: "",
        };
        await courseServices.createMaterial(payload);
        message.success("Material berhasil dibuat");
      } else if (editingMat) {
        await courseServices.updateMaterial(editingMat.id, {
          title: values.title.trim(),
          materials: isVideo ? "" : (values.materials ?? "").trim(),
          url_video: isVideo ? (values.url_video ?? "").trim() : "",
        });
        message.success("Material berhasil diperbarui");
      }
      closeMatModal();
      await loadMaterials(selectedSubLessonId);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMatDelete = useCallback(
    async (record: Material) => {
      try {
        await courseServices.deleteMaterial(record.id);
        message.success("Material berhasil dihapus");
        if (selectedSubLessonId !== null) await loadMaterials(selectedSubLessonId);
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal menghapus");
      }
    },
    [loadMaterials, message, selectedSubLessonId],
  );

  const lessonOptions = useMemo(
    () =>
      lessons.map((l) => ({
        label: `${l.title}`,
        value: l.id,
      })),
    [lessons],
  );

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size={16}>
      <div>
        <Text strong>Pilih Lesson</Text>
        <Select
          style={{ width: "100%", marginTop: 8 }}
          placeholder="Pilih lesson"
          value={selectedLessonId ?? undefined}
          options={lessonOptions}
          onChange={(val) => void handleSelectLesson(val)}
          showSearch
          optionFilterProp="label"
        />
      </div>

      {selectedLessonId !== null && (
        <Card
          title="Sub Lesson"
          loading={loadingSub}
          style={{ borderRadius: 8 }}
          extra={
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={openSubCreate}
            >
              Tambah Sub Lesson
            </Button>
          }
        >
          {subLessons.length === 0 ? (
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Belum ada sub lesson.
            </Paragraph>
          ) : (
            <Space orientation="vertical" style={{ width: "100%" }}>
              {subLessons.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background:
                      selectedSubLessonId === sub.id ? "#EEE8F7" : undefined,
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Space>
                    <Tag>{sub.order_position}</Tag>
                    <Text strong>{sub.title}</Text>
                  </Space>
                  <Space size={0}>
                    <Button
                      type="link"
                      onClick={() => void handleSelectSubLesson(sub.id)}
                    >
                      Kelola Material
                    </Button>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => openSubEdit(sub)}
                    />
                    <Popconfirm
                      title="Hapus sub lesson ini?"
                      okText="Hapus"
                      cancelText="Batal"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleSubDelete(sub)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                </div>
              ))}
            </Space>
          )}
        </Card>
      )}

      {selectedSubLessonId !== null && (
        <Card
          title="Material"
          loading={loadingMat}
          style={{ borderRadius: 8 }}
          extra={
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={openMatCreate}
            >
              Tambah Material
            </Button>
          }
        >
          {materials.length === 0 ? (
            <Empty description="Belum ada material" />
          ) : (
            <Space orientation="vertical" style={{ width: "100%" }}>
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: 8,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Space>
                      <Tag color={mat.url_video ? "blue" : "green"}>
                        {mat.url_video ? "Video" : "Teks"}
                      </Tag>
                      <Text strong>{mat.title}</Text>
                    </Space>
                  </div>
                  <Space size={0}>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => openMatEdit(mat)}
                    />
                    <Popconfirm
                      title="Hapus material ini?"
                      okText="Hapus"
                      cancelText="Batal"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleMatDelete(mat)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                </div>
              ))}
            </Space>
          )}
        </Card>
      )}

      {/* Modal Sub Lesson */}
      <Modal
        open={subModalOpen}
        title={subModalMode === "create" ? "Tambah Sub Lesson" : "Edit Sub Lesson"}
        okText="Simpan"
        cancelText="Batal"
        confirmLoading={submitting}
        onCancel={closeSubModal}
        onOk={() => subForm.submit()}
        afterClose={() => subForm.resetFields()}
      >
        <Form form={subForm} layout="vertical" onFinish={handleSubSubmit}>
          <Form.Item
            label="Judul Sub Lesson"
            name="title"
            rules={[{ required: true, message: "Judul sub lesson wajib diisi" }]}
          >
            <Input placeholder="Contoh: Pengenalan Variabel" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Material */}
      <Modal
        open={matModalOpen}
        title={matModalMode === "create" ? "Tambah Material" : "Edit Material"}
        okText="Simpan"
        cancelText="Batal"
        confirmLoading={submitting}
        onCancel={closeMatModal}
        onOk={() => matForm.submit()}
        afterClose={() => matForm.resetFields()}
        width={640}
      >
        <Form form={matForm} layout="vertical" onFinish={handleMatSubmit}>
          <Form.Item
            label="Judul Material"
            name="title"
            rules={[{ required: true, message: "Judul material wajib diisi" }]}
          >
            <Input placeholder="Judul section" />
          </Form.Item>

          <Form.Item label="Tipe" name="contentType">
            <Segmented
              options={[
                { label: "Teks", value: "text" },
                { label: "Video", value: "video" },
              ]}
            />
          </Form.Item>

          {matContentType === "video" ? (
            <Form.Item
              label="URL Video"
              name="url_video"
              rules={[{ required: true, message: "URL video wajib diisi" }]}
            >
              <Input placeholder="https://youtube.com/..." />
            </Form.Item>
          ) : (
            <Form.Item
              label="Materi Teks"
              name="materials"
              rules={[{ required: true, message: "Materi wajib diisi" }]}
            >
              <Input.TextArea rows={6} placeholder="Tulis materi di sini" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Space>
  );
}

export default SubLessonMaterialTab;
