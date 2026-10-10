"use client";

import React from "react";
import { Table as AntTable, TableProps as AntTableProps } from "antd";

export type TableProps<T = object> = AntTableProps<T>;

export function Table<T extends object = object>(props: TableProps<T>) {
  return <AntTable<T> {...props} />;
}

export default Table;
