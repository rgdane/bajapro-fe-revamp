"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Empty,
  Flex,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useUserDetail } from "../hooks/useUserDetail";
import { useClasses } from "../hooks/useReference";
import { UserRoleTag } from "./UserRoleTag";

const { Title, Paragraph } = Typography;

function dash(value?: string | number | null) {
  return value === null || value === undefined || value === "" ? "—" : value;
}

export function UserDetail({ userId }: { userId: number }) {
  const router = useRouter();
  const { user, loading, error } = useUserDetail(userId);
  const { classes, loading: classesLoading } = useClasses(
    { teacher_id: userId },
    user?.role === "teacher",
  );

  const goBack = () => router.push("/manage-user/user");
  const goEdit = () => router.push(`/manage-user/user?edit=${userId}`);

  const role = user?.role;
  const teacherClasses = role === "teacher" ? classes : [];
  const studentClass = role === "student" && user?.class ? [user.class] : [];
  const listedClasses = role === "teacher" ? teacherClasses : studentClass;

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ borderRadius: 12, padding: 12, border: "1px solid #f0f0f0" }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <div>
            <Title level={3} style={{ marginBottom: 4, marginTop: 0 }}>
              Detail User
            </Title>
            <Paragraph style={{ color: "gray", marginTop: 0, marginBottom: 0 }}>
              Informasi pengguna dan relasinya
            </Paragraph>
          </div>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={goBack}>
              Kembali
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              disabled={!user}
              onClick={goEdit}
              style={{ backgroundColor: "#7246BA" }}
            >
              Edit
            </Button>
          </Space>
        </Flex>

        <div style={{ marginTop: 24 }}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : error ? (
            <Alert
              type="error"
              showIcon
              message="Gagal memuat detail user"
              description={error}
            />
          ) : !user ? (
            <Alert
              type="warning"
              showIcon
              message="User tidak ditemukan"
              description={`Tidak ada user dengan id ${userId}.`}
            />
          ) : (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Kode">{dash(user.code)}</Descriptions.Item>
              <Descriptions.Item label="Nama">{dash(user.name)}</Descriptions.Item>
              <Descriptions.Item label="Email">{dash(user.email)}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <UserRoleTag role={user.role} />
              </Descriptions.Item>
              <Descriptions.Item label="School Name">
                {dash(user.school?.school_name)}
              </Descriptions.Item>
              <Descriptions.Item label="NIP">{dash(user.nip)}</Descriptions.Item>
              <Descriptions.Item label="List Kelas">
                {role === "admin" ? (
                  "—"
                ) : classesLoading ? (
                  <Skeleton.Input active size="small" />
                ) : listedClasses.length ? (
                  <Space size={[8, 8]} wrap>
                    {listedClasses.map((c) => (
                      <Tag key={c.id} color="geekblue">
                        {c.class_name} ({c.class_code})
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Belum memiliki kelas"
                  />
                )}
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>
      </Card>
    </div>
  );
}

export default UserDetail;
