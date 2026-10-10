"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Select, Switch } from "antd";
import { schoolServices } from "@/features/school/services/schoolServices";
import type { SchoolRef } from "../types/kelasTypes";
import { useTeachers } from "../hooks/useKelas";

export function KelasFormFields() {
  const [schools, setSchools] = useState<SchoolRef[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const { teachers, loading: teachersLoading } = useTeachers();

  useEffect(() => {
    let active = true;
    void (async () => {
      setSchoolsLoading(true);
      try {
        const res = await schoolServices.getSchools();
        if (active) setSchools(res.data ?? []);
      } catch {
        if (active) setSchools([]);
      } finally {
        if (active) setSchoolsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const schoolOptions = schools.map((s) => ({
    label: s.school_name,
    value: s.id,
  }));

  const teacherOptions = teachers.map((t) => ({
    label: t.name,
    value: t.id,
  }));

  return (
    <>
      <Form.Item
        label="Nama Kelas"
        name="class_name"
        rules={[{ required: true, message: "Nama kelas wajib diisi" }]}
      >
        <Input placeholder="Contoh: X RPL 1" />
      </Form.Item>

      <Form.Item
        label="Kode Kelas"
        name="class_code"
        rules={[{ required: true, message: "Kode kelas wajib diisi" }]}
      >
        <Input placeholder="Contoh: RPL-X-001" />
      </Form.Item>

      <Form.Item
        label="Sekolah"
        name="school_id"
        rules={[{ required: true, message: "Sekolah wajib dipilih" }]}
      >
        <Select
          placeholder="Pilih sekolah"
          loading={schoolsLoading}
          showSearch
          optionFilterProp="label"
          options={schoolOptions}
        />
      </Form.Item>

      <Form.Item label="Wali Kelas" name="teacher_id">
        <Select
          placeholder="Pilih teacher (opsional)"
          loading={teachersLoading}
          showSearch
          allowClear
          optionFilterProp="label"
          options={teacherOptions}
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
  );
}

export default KelasFormFields;
