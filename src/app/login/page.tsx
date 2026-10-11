"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { App, Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { authServices } from "@/features/auth/services/authServices";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

const { Title, Paragraph } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await authServices.login({
        email: values.email.trim(),
        password: values.password,
      });
      message.success("Login berhasil");
      router.replace("/manage-user/user");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card style={{ width: "100%", borderRadius: 12 }}>
        <Title level={3} style={{ marginBottom: 4, color: "#531DAB" }}>
          BAJAPRO
        </Title>
        <Paragraph style={{ color: "gray", marginTop: 0 }}>
          Masuk untuk mengelola data
        </Paragraph>

        <Form<LoginFormValues>
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email wajib diisi" },
              { type: "email", message: "Format email tidak valid" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="user@bajapro.id"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password wajib diisi" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Masukkan password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{ backgroundColor: "#7246BA" }}
          >
            Masuk
          </Button>
        </Form>

        <Paragraph style={{ textAlign: "center", marginTop: 16, marginBottom: 0 }}>
          Belum punya akun?{" "}
          <Link href="/register" style={{ color: "#531DAB" }}>
            Daftar
          </Link>
        </Paragraph>
      </Card>
    </AuthLayout>
  );
}
