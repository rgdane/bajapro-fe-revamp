"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Flex, Space } from "antd";
import { PlusOutlined, SearchOutlined, FilterOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";
import { MasterTable } from "@/components/fragments/MasterTable";
import type { MasterTableProps } from "@/components/fragments/MasterTable";
import { MasterFormModal } from "@/components/fragments/MasterFormModal";

const { Title, Paragraph } = Typography;

export type MasterModalMode = "create" | "edit";

export interface MasterModalConfig<TValues extends object = Record<string, unknown>> {
  title?: string;
  fields: React.ReactNode | ((ctx: { mode: MasterModalMode }) => React.ReactNode);
  onCreate: (values: TValues) => Promise<void> | void;
  onUpdate: (values: TValues, record: TValues) => Promise<void> | void;
  submitLoading?: boolean;
}

export interface MasterTemplateProps<TValues extends object = Record<string, unknown>> {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  searchDefaultValue?: string;
  onSearchChange?: (value: string) => void;
  onFilter?: () => void;
  showFilter?: boolean;
  extraActions?: React.ReactNode;
  tableProps: Omit<MasterTableProps<TValues>, "header">;
  modal?: MasterModalConfig<TValues>;
  children?: React.ReactNode;
}

export function MasterTemplate<TValues extends object = Record<string, unknown>>({
  title,
  subtitle,
  onAdd,
  addLabel = "Tambah Data",
  onSearch,
  searchPlaceholder = "Cari...",
  searchDefaultValue,
  onSearchChange,
  onFilter,
  showFilter = true,
  extraActions,
  tableProps,
  modal,
  children,
}: MasterTemplateProps<TValues>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<MasterModalMode>("create");
  const [editingRecord, setEditingRecord] = useState<TValues | null>(null);

  const columns = useMemo<ColumnsType<TValues>>(() => {
    if (!modal) return tableProps.columns ?? [];
    const actionColumn = {
      title: "Aksi",
      key: "action",
      width: 120,
      render: (_: unknown, record: TValues) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            setModalMode("edit");
            setEditingRecord(record);
            setModalOpen(true);
          }}
        >
          Edit
        </Button>
      ),
    };
    return [...(tableProps.columns ?? []), actionColumn];
  }, [modal, tableProps.columns]);

  const handleAdd = () => {
    if (modal) {
      setModalMode("create");
      setEditingRecord(null);
      setModalOpen(true);
    } else {
      onAdd?.();
    }
  };

  const fields = modal
    ? typeof modal.fields === "function"
      ? modal.fields({ mode: modalMode })
      : modal.fields
    : null;

  return (
    <div style={{ padding: 24 }}>
      <Card
        style={{
          borderRadius: 12,
          padding: 12,
          border: "1px solid #f0f0f0",
        }}
      >
        <Title level={3} style={{ marginBottom: 4, marginTop: 0 }}>
          {title}
        </Title>
        {subtitle && (
          <Paragraph style={{ color: "gray", marginTop: 0, marginBottom: 24 }}>
            {subtitle}
          </Paragraph>
        )}

        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={16}
          style={{ marginBottom: 16 }}
        >
          {onAdd || modal ? (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{
                backgroundColor: "#7246BA",
                borderRadius: 8,
              }}
            >
              {addLabel}
            </Button>
          ) : (
            <div />
          )}

          <Space size="small" align="center">
            <SearchInput
              size="large"
              allowClear
              defaultValue={searchDefaultValue}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onSearch={onSearch}
              prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
              style={{ borderRadius: 8, width: 250 }}
            />
            {showFilter && (
              <Button
                size="large"
                icon={<FilterOutlined />}
                onClick={onFilter}
                style={{ borderRadius: 8 }}
              >
                Filter
              </Button>
            )}
            {extraActions}
          </Space>
        </Flex>

        <MasterTable {...tableProps} columns={columns} />

        {modal && (
          <MasterFormModal<TValues>
            open={modalOpen}
            mode={modalMode}
            title={modal.title}
            onCancel={() => setModalOpen(false)}
            onSubmit={async (values) => {
              try {
                if (modalMode === "create") {
                  await modal.onCreate(values);
                } else if (editingRecord) {
                  await modal.onUpdate(values, editingRecord);
                }
                setModalOpen(false);
              } catch {
                setModalOpen(false);
              }
            }}
            submitLoading={modal.submitLoading}
            initialValues={modalMode === "edit" && editingRecord ? editingRecord : undefined}
            fields={fields}
          />
        )}

        {children}
      </Card>
    </div>
  );
}

export default MasterTemplate;