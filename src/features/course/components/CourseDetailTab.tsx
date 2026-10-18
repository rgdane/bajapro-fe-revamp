"use client";

import React, { useEffect, useState } from "react";
import { App, Button, Form, Image, Input, Space, Upload } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { uploadService } from "../services/uploadService";
import type { Course, CreateCourseDTO } from "../types/courseTypes";

interface CourseFormValues {
  course_name: string;
  description: string;
}

export interface CourseDetailTabProps {
  course: Course | null;
  saving?: boolean;
  onSubmit: (values: CreateCourseDTO) => Promise<void> | void;
}

export function CourseDetailTab({
  course,
  saving = false,
  onSubmit,
}: CourseDetailTabProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<CourseFormValues>();
  const [thumbnail, setThumbnail] = useState(course?.img_thumbnail ?? "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        course_name: course.course_name,
        description: course.description,
      });
    } else {
      form.resetFields();
    }
  }, [course, form]);

  const handleUpload = async (file: File): Promise<boolean> => {
    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      setThumbnail(url);
      message.success("Thumbnail berhasil diunggah");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Gagal mengunggah");
    } finally {
      setUploading(false);
    }
    // Cegah antd mengunggah otomatis; kita kirim sendiri ke backend.
    return false;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) =>
        onSubmit({
          course_name: values.course_name.trim(),
          description: (values.description ?? "").trim(),
          img_thumbnail: thumbnail,
        })
      }
    >
      <Form.Item
        label="Nama Course"
        name="course_name"
        rules={[{ required: true, message: "Nama course wajib diisi" }]}
      >
        <Input placeholder="Contoh: Java Basic 1" />
      </Form.Item>

      <Form.Item
        label="Deskripsi"
        name="description"
        rules={[{ required: true, message: "Deskripsi wajib diisi" }]}
      >
        <Input.TextArea rows={4} placeholder="Deskripsi course" />
      </Form.Item>

      <Form.Item label="Thumbnail">
        <Space orientation="vertical" size={8}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Thumbnail course"
              width={220}
              style={{ borderRadius: 8, objectFit: "cover" }}
            />
          ) : null}
          <Space>
            <Upload
              accept="image/png,image/jpeg,image/webp,image/gif"
              showUploadList={false}
              beforeUpload={(file) => handleUpload(file as File)}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {thumbnail ? "Ganti Gambar" : "Unggah Gambar"}
              </Button>
            </Upload>
            {thumbnail ? (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => setThumbnail("")}
              >
                Hapus
              </Button>
            ) : null}
          </Space>
          <span style={{ color: "#8c8c8c", fontSize: 12 }}>
            JPG, PNG, WEBP, atau GIF. Maksimal 5 MB.
          </span>
        </Space>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={saving}
          style={{ backgroundColor: "#7246BA" }}
        >
          Simpan
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CourseDetailTab;
