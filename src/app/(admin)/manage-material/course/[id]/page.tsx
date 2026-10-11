import React, { Suspense } from "react";
import CourseDetail from "@/features/course/components/CourseDetail";
import { AdminGuard } from "@/features/auth/components/AdminGuard";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <CourseDetail courseId={Number(id)} />
      </AdminGuard>
    </Suspense>
  );
}
