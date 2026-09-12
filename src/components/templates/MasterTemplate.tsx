"use client";

import React from "react";
import { Card, Typography, Flex, Space } from "antd";
import { PlusOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";
import { MasterTable } from "@/components/fragments/MasterTable";
import type { MasterTableProps } from "@/components/fragments/MasterTable";

const { Title, Paragraph } = Typography;

export interface MasterTemplateProps {
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
  tableProps: Omit<MasterTableProps, "header">;
  children?: React.ReactNode;
}

export const MasterTemplate: React.FC<MasterTemplateProps> = ({
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
  children,
}) => {
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
          {onAdd ? (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={onAdd}
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

        <MasterTable {...tableProps} />

        {children}
      </Card>
    </div>
  );
};

export default MasterTemplate;