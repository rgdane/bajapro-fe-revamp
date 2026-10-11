"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Card, Flex, Segmented, Spin, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/Button";
import { useCourseDetail } from "../hooks/useCourseDetail";
import { CourseDetailTab } from "./CourseDetailTab";
import { LessonTab } from "./LessonTab";
import { SubLessonMaterialTab } from "./SubLessonMaterialTab";
import type { CreateCourseDTO } from "../types/courseTypes";

const { Title, Paragraph } = Typography;

type TabKey = "detail" | "lessons" | "materials";

export interface CourseDetailProps {
  courseId: number | null;
}

export default function CourseDetail({ courseId }: CourseDetailProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const { course, loading, error, saveCourse } = useCourseDetail(courseId);

  const isCreate = courseId === null;
  const [activeTab, setActiveTab] = useState<TabKey>("detail");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const handleTabChange = (key: string) => {
    if (isCreate && key !== "detail") {
      message.warning("Simpan Detail Course terlebih dahulu!");
      return;
    }
    setActiveTab(key as TabKey);
  };

  const handleSaveCourse = async (values: CreateCourseDTO) => {
    setSaving(true);
    try {
      const id = await saveCourse(values);
      if (isCreate) {
        message.success("Course berhasil dibuat");
        router.replace(`/manage-material/course/${id}`);
      } else {
        message.success("Course berhasil diperbarui");
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const segmentedOptions = useMemo(
    () => [
      { label: "Detail Course", value: "detail" },
      { label: "Lessons", value: "lessons" },
      { label: "Sub Lessons & Materials", value: "materials" },
    ],
    [],
  );

  return (
    <div style={{ padding: 24 }}>
      <Card
        style={{ borderRadius: 12, padding: 12, border: "1px solid #f0f0f0" }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <div>
            <Title level={3} style={{ marginBottom: 4, marginTop: 0 }}>
              {isCreate ? "Tambah Course" : "Detail Course"}
            </Title>
            <Paragraph style={{ color: "gray", marginTop: 0, marginBottom: 0 }}>
              {isCreate
                ? "Buat course baru"
                : course?.course_name ?? "Kelola lesson dan materi"}
            </Paragraph>
          </div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/manage-material/course")}
          >
            Kembali
          </Button>
        </Flex>

        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Segmented
            options={segmentedOptions}
            value={activeTab}
            onChange={(val) => handleTabChange(String(val))}
          />
        </div>

        <Spin spinning={loading}>
          {activeTab === "detail" && (
            <CourseDetailTab
              course={course}
              saving={saving}
              onSubmit={handleSaveCourse}
            />
          )}

          {activeTab === "lessons" && !isCreate && courseId !== null && (
            <LessonTab courseId={courseId} />
          )}

          {activeTab === "materials" && !isCreate && courseId !== null && (
            <SubLessonMaterialTab courseId={courseId} />
          )}
        </Spin>
      </Card>
    </div>
  );
}
