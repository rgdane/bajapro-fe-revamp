import React, { Suspense } from "react";
import CourseDetail from "@/features/course/components/CourseDetail";
import { AdminGuard } from "@/features/auth/components/AdminGuard";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <CourseDetail courseId={null} />
      </AdminGuard>
    </Suspense>
  );
}
