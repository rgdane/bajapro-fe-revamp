"use client";

import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
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
  const [form] = Form.useForm<CourseFormValues>();

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

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) =>
        onSubmit({
          course_name: values.course_name.trim(),
          description: (values.description ?? "").trim(),
          img_thumbnail: course?.img_thumbnail ?? "",
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
