"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, App, Button, Card, Form, Input, Segmented, Select, Typography } from "antd";
import { LockOutlined, MailOutlined, NumberOutlined, UserOutlined } from "@ant-design/icons";
import { apiRequest } from "@/lib/apiClient";
import { authServices } from "../services/authServices";
import { AuthLayout } from "./AuthLayout";
import type { RegisterPayload, RegisterRole } from "../types/authTypes";

const { Title, Paragraph } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirm: string;
  role: RegisterRole;
  school_mode?: string;
  nip?: string;
  class_code?: string;
  school_id?: number;
  proposed_school_name?: string;
}

interface SchoolOption {
  id: number;
  school_name: string;
  isactive: boolean;
}

export default function RegisterForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<RegisterFormValues>();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  const role = Form.useWatch<RegisterRole>("role", form);
  const schoolMode = Form.useWatch<string>("school_mode", form);

  useEffect(() => {
    let active = true;
    void (async () => {
      setSchoolsLoading(true);
      try {
        const res = await apiRequest<SchoolOption[]>("/auth/schools");
        if (active) setSchools((res.data ?? []).filter((s) => s.isactive));
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

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const result = await authServices.register(buildPayload(values, schoolMode));
      if (result.pending) {
        message.success("Registrasi berhasil. Menunggu persetujuan admin.");
        router.replace("/waiting-approval");
        return;
      }
      message.success("Registrasi berhasil");
      router.replace("/manage-user/user");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card style={{ width: "100%", borderRadius: 12 }}>
        <Title level={3} style={{ marginBottom: 4, color: "#531DAB" }}>
          Daftar BAJAPRO
        </Title>
        <Paragraph style={{ color: "gray", marginTop: 0 }}>
          Buat akun untuk mulai belajar mengajar
        </Paragraph>

        <Form<RegisterFormValues>
          form={form}
          layout="vertical"
          initialValues={{ role: "student", school_mode: "existing" }}
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Nama"
            name="name"
            rules={[{ required: true, message: "Nama wajib diisi" }]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Nama lengkap" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email wajib diisi" },
              { type: "email", message: "Format email tidak valid" },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="user@bajapro.id" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password wajib diisi" },
              { min: 6, message: "Password minimal 6 karakter" },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Masukkan password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            label="Konfirmasi Password"
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Konfirmasi password wajib diisi" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Password tidak sama"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Ulangi password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item label="Daftar sebagai" name="role">
            <Segmented
              block
              options={[
                { label: "Siswa", value: "student" },
                { label: "Guru", value: "teacher" },
              ]}
            />
          </Form.Item>

          {role === "student" && (
            <Form.Item
              label="Kode Kelas"
              name="class_code"
              rules={[{ required: true, message: "Kode kelas wajib diisi" }]}
              extra="Minta kode kelas ke guru Anda."
            >
              <Input size="large" placeholder="Contoh: RPL-X-001" />
            </Form.Item>
          )}

          {role === "teacher" && (
            <>
              <Form.Item label="NIP" name="nip">
                <Input size="large" prefix={<NumberOutlined />} placeholder="NIP (opsional)" />
              </Form.Item>

              <Form.Item label="Sekolah" name="school_mode">
                <Segmented
                  block
                  options={[
                    { label: "Sekolah Terdaftar", value: "existing" },
                    { label: "Usulan Sekolah Baru", value: "proposed" },
                  ]}
                  onChange={() =>
                    form.setFieldsValue({
                      school_id: undefined,
                      proposed_school_name: undefined,
                    })
                  }
                />
              </Form.Item>

              {schoolMode === "proposed" ? (
                <Form.Item
                  label="Nama Sekolah Baru"
                  name="proposed_school_name"
                  rules={[{ required: true, message: "Nama sekolah wajib diisi" }]}
                  extra="Sekolah akan dibuat setelah disetujui admin."
                >
                  <Input size="large" placeholder="Contoh: SMK Negeri 3 Surabaya" />
                </Form.Item>
              ) : (
                <Form.Item
                  label="Pilih Sekolah"
                  name="school_id"
                  rules={[{ required: true, message: "Sekolah wajib dipilih" }]}
                >
                  <Select
                    size="large"
                    placeholder="Pilih sekolah"
                    loading={schoolsLoading}
                    showSearch
                    optionFilterProp="label"
                    options={schoolOptions}
                  />
                </Form.Item>
              )}

              <Alert
                type="info"
                showIcon
                message="Akun guru perlu disetujui admin sebelum bisa masuk."
                style={{ marginBottom: 16 }}
              />
            </>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{ backgroundColor: "#7246BA" }}
          >
            Daftar
          </Button>
        </Form>

        <Paragraph style={{ textAlign: "center", marginTop: 16, marginBottom: 0 }}>
          Sudah punya akun? <Link href="/login">Masuk</Link>
        </Paragraph>
      </Card>
    </AuthLayout>
  );
}

function buildPayload(
  values: RegisterFormValues,
  schoolMode: string | undefined,
): RegisterPayload {
  const payload: RegisterPayload = {
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    role: values.role,
  };

  if (values.role === "student") {
    payload.class_code = values.class_code?.trim();
    return payload;
  }

  payload.nip = values.nip?.trim() || null;
  if (schoolMode === "proposed") {
    payload.proposed_school_name = values.proposed_school_name?.trim();
  } else {
    payload.school_id = values.school_id;
  }
  return payload;
}
