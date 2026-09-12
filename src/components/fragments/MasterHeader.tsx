"use client";

import React from "react";
import { Flex, Space, Typography } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/Input";

const { Text } = Typography;

export interface MasterHeaderProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  searchDefaultValue?: string;
  onSearchChange?: (value: string) => void;
  extra?: React.ReactNode;
}

export const MasterHeader: React.FC<MasterHeaderProps> = ({
  title,
  onAdd,
  addLabel = "Tambah Data",
  onSearch,
  searchPlaceholder = "Cari data...",
  searchDefaultValue,
  onSearchChange,
  extra,
}) => {
  return (
    <Flex vertical gap={16}>
      <Flex align="center" justify="space-between">
        <Space align="center">
          <Text strong style={{ fontSize: 20 }}>
            {title}
          </Text>
        </Space>
        <Space>
          {extra}
          {onAdd && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              {addLabel}
            </Button>
          )}
        </Space>
      </Flex>

      <Flex justify="space-between" align="center">
        <SearchInput
          allowClear
          defaultValue={searchDefaultValue}
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onSearch={onSearch}
          style={{ maxWidth: 320 }}
          prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
        />
      </Flex>
    </Flex>
  );
};

export default MasterHeader;