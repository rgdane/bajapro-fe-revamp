"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Popconfirm, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { MasterTemplate } from "@/components/templates/MasterTemplate";
import { Button } from "@/components/ui/Button";
import { useCourse } from "../hooks/useCourse";
import type { Course } from "../types/courseTypes";

export default function MasterCourse() {
  const router = useRouter();
  const { message } = App.useApp();
  const { courses, loading, error, deleteCourse } = useCourse();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const handleDelete = useCallback(
    async (record: Course) => {
      try {
        await deleteCourse(record.id);
        message.success("Course berhasil dihapus");
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal menghapus");
      }
    },
    [deleteCourse, message],
  );

  const filtered = useMemo(() => {
    if (!search) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.course_name.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q),
    );
  }, [search, courses]);

  const columns: ColumnsType<Course> = useMemo(
    () => [
      {
        title: "No",
        key: "no",
        width: 60,
        render: (_v, _r, index) => index + 1,
      },
      { title: "Nama Course", dataIndex: "course_name", key: "course_name" },
      {
        title: "Deskripsi",
        dataIndex: "description",
        key: "description",
        render: (val: string) =>
          val ? (val.length > 80 ? `${val.slice(0, 80)}...` : val) : "—",
      },
      {
        title: "Jumlah Lesson",
        key: "lessonCount",
        width: 130,
        render: (_, record) => record.lessonCount ?? 0,
      },
      {
        title: "Jumlah Sub Lesson",
        key: "subLessonCount",
        width: 150,
        render: (_, record) => record.subLessonCount ?? 0,
      },
      {
        title: "Status",
        key: "isactive",
        width: 100,
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
        width: 220,
        render: (_, record) => (
          <Space size={0}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/manage-material/course/${record.id}`)}
            >
              Detail
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => router.push(`/manage-material/course/${record.id}`)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Hapus course ini?"
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
    [handleDelete, router],
  );

  return (
    <MasterTemplate<Course>
      title="List Course"
      subtitle="Kelola course, lesson, dan materi"
      addLabel="Tambah Course"
      onAdd={() => router.push("/manage-material/course/add")}
      onSearch={setSearch}
      searchPlaceholder="Cari nama course"
      tableProps={{
        columns,
        dataSource: filtered,
        loading,
      }}
    />
  );
}
