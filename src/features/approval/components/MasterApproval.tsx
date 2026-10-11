"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { App, Form, Input, Modal, Popconfirm, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { MasterTemplate } from "@/components/templates/MasterTemplate";
import { Button } from "@/components/ui/Button";
import { useApproval } from "../hooks/useApproval";
import type { RegistrationRequest } from "../types/approvalTypes";

interface RejectFormValues {
  rejection_note: string;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function schoolLabel(record: RegistrationRequest): string {
  const school = record.school;
  if (!school) return "—";
  if (school.existing_school?.school_name) return school.existing_school.school_name;
  if (school.proposed_school_name) return `Usulan: ${school.proposed_school_name}`;
  return "—";
}

function isProposedSchool(record: RegistrationRequest): boolean {
  const school = record.school;
  return !!school && !school.existing_school?.school_name && !!school.proposed_school_name;
}

export default function MasterApproval() {
  const { message } = App.useApp();
  const { requests, loading, error, approve, reject } = useApproval();

  const [form] = Form.useForm<RejectFormValues>();
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState<RegistrationRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const handleApprove = useCallback(
    async (record: RegistrationRequest) => {
      try {
        await approve(record.id);
        message.success(`Pengajar ${record.name} disetujui`);
      } catch (err) {
        message.error(err instanceof Error ? err.message : "Gagal menyetujui");
      }
    },
    [approve, message],
  );

  const closeReject = useCallback(() => {
    setRejectTarget(null);
    form.resetFields();
  }, [form]);

  const handleRejectSubmit = async (values: RejectFormValues) => {
    if (!rejectTarget) return;
    setSubmitting(true);
    try {
      await reject(rejectTarget.id, values.rejection_note.trim());
      message.success(`Pengajar ${rejectTarget.name} ditolak`);
      closeReject();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Gagal menolak");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return requests;
    const q = search.toLowerCase();
    return requests.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.nip ?? "").toLowerCase().includes(q) ||
        schoolLabel(r).toLowerCase().includes(q),
    );
  }, [search, requests]);

  const columns: ColumnsType<RegistrationRequest> = useMemo(
    () => [
      { title: "Nama", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      {
        title: "NIP",
        dataIndex: "nip",
        key: "nip",
        render: (val: string | null) => val ?? "—",
      },
      {
        title: "Sekolah",
        key: "school",
        render: (_, record) => (
          <Space size={4}>
            {schoolLabel(record)}
            {isProposedSchool(record) && <Tag color="gold">Sekolah baru</Tag>}
          </Space>
        ),
      },
      {
        title: "Tanggal Daftar",
        dataIndex: "created_at",
        key: "created_at",
        render: (val: string) => formatDate(val),
      },
      {
        title: "Aksi",
        key: "action",
        width: 200,
        render: (_, record) => (
          <Space size={0}>
            <Popconfirm
              title="Setujui pengajar ini?"
              description={
                isProposedSchool(record)
                  ? "Sekolah usulan akan dibuat otomatis."
                  : undefined
              }
              okText="Setujui"
              cancelText="Batal"
              onConfirm={() => handleApprove(record)}
            >
              <Button type="link" icon={<CheckOutlined />}>
                Setujui
              </Button>
            </Popconfirm>
            <Button
              type="link"
              danger
              icon={<CloseOutlined />}
              onClick={() => setRejectTarget(record)}
            >
              Tolak
            </Button>
          </Space>
        ),
      },
    ],
    [handleApprove],
  );

  return (
    <>
      <MasterTemplate<RegistrationRequest>
        title="Approval Pengajar"
        subtitle="Setujui atau tolak pendaftaran guru"
        onSearch={setSearch}
        searchPlaceholder="Cari nama, email, atau NIP"
        tableProps={{
          columns,
          dataSource: filtered,
          loading,
        }}
      />

      <Modal
        open={!!rejectTarget}
        title={`Tolak pengajar${rejectTarget ? ` — ${rejectTarget.name}` : ""}`}
        okText="Tolak"
        cancelText="Batal"
        okButtonProps={{ danger: true }}
        confirmLoading={submitting}
        onCancel={closeReject}
        onOk={() => form.submit()}
        afterClose={() => form.resetFields()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRejectSubmit}
        >
          <Form.Item
            label="Alasan Penolakan"
            name="rejection_note"
            rules={[{ required: true, message: "Alasan penolakan wajib diisi" }]}
          >
            <Input.TextArea
              rows={4}
              maxLength={500}
              showCount
              placeholder="Jelaskan alasan penolakan"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
