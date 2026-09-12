"use client";

import React from "react";
import { Table as AntTable, TableProps as AntTableProps } from "antd";

export interface TableProps<T = any> extends AntTableProps<T> {}

export function Table<T extends object = any>(props: TableProps<T>) {
  return <AntTable<T> {...props} />;
}

export default Table;
