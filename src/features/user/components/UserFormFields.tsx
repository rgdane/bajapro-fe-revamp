"use client";

import React from "react";
import { Alert, Form, Input, Select } from "antd";
import type { FormInstance } from "antd";
import { useClasses, useSchools } from "../hooks/useReference";
import { USER_ROLES, type UserRole } from "../types/userTypes";

export interface UserFormFieldsProps {
  form: FormInstance;
  mode: "create" | "edit";
}

export function UserFormFields({ form, mode }: UserFormFieldsProps) {
  const role = Form.useWatch<UserRole | undefined>("role", form);
  const schoolId = Form.useWatch<number | undefined>("school_id", form);

  const { schools, loading: schoolsLoading, error: schoolsError } = useSchools();
  const {
    classes,
    loading: classesLoading,
    error: classesError,
  } = useClasses({ school_id: schoolId }, role === "student");

  const schoolOptions = schools.map((s) => ({
    label: s.school_name,
    value: s.id,
  }));

  const classOptions = classes.map((c) => ({
    label: `${c.class_name} (${c.class_code})`,
    value: c.id,
  }));

  return (
    <>
      <Form.Item
        label="Nama"
        name="name"
        rules={[{ required: true, message: "Nama wajib diisi" }]}
      >
        <Input placeholder="Masukkan nama lengkap" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Email wajib diisi" },
          { type: "email", message: "Format email tidak valid" },
        ]}
      >
        <Input placeholder="user@bajapro.id" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={
          mode === "create"
            ? [{ required: true, message: "Password wajib diisi" }]
            : []
        }
        extra={
          mode === "edit"
            ? "Biarkan kosong jika tidak ingin mengubah password."
            : undefined
        }
      >
        <Input.Password placeholder="Masukkan password" autoComplete="new-password" />
      </Form.Item>

      <Form.Item label="NIP" name="nip">
        <Input placeholder="NIP (opsional)" />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: "Role wajib dipilih" }]}
      >
        <Select
          placeholder="Pilih role"
          options={USER_ROLES}
          onChange={() => {
            form.setFieldsValue({ school_id: undefined, class_id: undefined });
          }}
        />
      </Form.Item>

      {(role === "teacher" || role === "student") && (
        <Form.Item
          label="School"
          name="school_id"
          rules={[{ required: true, message: "Sekolah wajib dipilih" }]}
        >
          <Select
            placeholder="Pilih sekolah"
            loading={schoolsLoading}
            showSearch
            optionFilterProp="label"
            options={schoolOptions}
            onChange={() => form.setFieldValue("class_id", undefined)}
          />
        </Form.Item>
      )}

      {role === "student" && (
        <Form.Item
          label="Class"
          name="class_id"
          rules={[{ required: true, message: "Kelas wajib dipilih" }]}
        >
          <Select
            placeholder={schoolId ? "Pilih kelas" : "Pilih sekolah terlebih dahulu"}
            loading={classesLoading}
            disabled={!schoolId}
            showSearch
            optionFilterProp="label"
            options={classOptions}
          />
        </Form.Item>
      )}

      {role === "teacher" && (
        <Alert
          type="info"
          showIcon
          message="Penetapan kelas untuk teacher dilakukan melalui Master Kelas"
          description="Backend menautkan teacher ke kelas lewat m_class.teacher_id, bukan lewat form user."
        />
      )}

      {schoolsError && (
        <Alert type="warning" showIcon message={schoolsError} style={{ marginTop: 8 }} />
      )}
      {classesError && role === "student" && (
        <Alert type="warning" showIcon message={classesError} style={{ marginTop: 8 }} />
      )}
    </>
  );
}

export default UserFormFields;
