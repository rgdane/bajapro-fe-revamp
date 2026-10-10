"use client";

import React from "react";
import { Tag } from "antd";
import type { UserRole } from "../types/userTypes";

export const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  admin: { label: "Admin", color: "purple" },
  teacher: { label: "Teacher", color: "blue" },
  student: { label: "Student", color: "green" },
};

export function roleLabel(role?: string | null): string {
  if (!role) return "—";
  return ROLE_META[role as UserRole]?.label ?? role;
}

export function UserRoleTag({ role }: { role?: string | null }) {
  if (!role) return <>—</>;
  const meta = ROLE_META[role as UserRole];
  return <Tag color={meta?.color ?? "default"}>{meta?.label ?? role}</Tag>;
}

export default UserRoleTag;
