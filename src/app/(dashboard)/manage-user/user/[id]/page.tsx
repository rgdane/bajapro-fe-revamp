import React from "react";
import UserDetail from "@/features/user/components/UserDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetail userId={Number(id)} />;
}
