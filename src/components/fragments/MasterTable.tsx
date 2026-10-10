"use client";

import React from "react";
import { Card, Flex } from "antd";
import { Table, TableProps } from "@/components/ui/Table";
import type { TablePaginationConfig } from "antd/es/table";

export interface MasterTableProps<T extends object = Record<string, unknown>>
  extends TableProps<T> {
  loading?: boolean;
  paginationConfig?: TablePaginationConfig;
  onChangeTable?: TableProps<T>["onChange"];
  header?: React.ReactNode;
}

export function MasterTable<T extends object = Record<string, unknown>>({
  loading = false,
  paginationConfig,
  onChangeTable,
  ...props
}: MasterTableProps<T>) {
  const defaultPagination: TablePaginationConfig = {
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "25", "50", "100"],
    showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} data`,
    ...paginationConfig,
  };

  return (
    <Card
      styles={{ body: { padding: 0 } }}
      style={{ borderRadius: 8, overflow: "hidden" }}
    >
      <Flex vertical>
        <Table<T>
          rowKey={(record: T) =>
            (record as unknown as { id?: React.Key }).id ?? JSON.stringify(record)
          }
          loading={loading}
          pagination={defaultPagination}
          onChange={onChangeTable}
          style={{ width: "100%" }}
          {...props}
        />
      </Flex>
    </Card>
  );
}

export default MasterTable;