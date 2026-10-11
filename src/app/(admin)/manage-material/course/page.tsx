import React, { Suspense } from "react";
import MasterCourse from "@/features/course/components/MasterCourse";
import { AdminGuard } from "@/features/auth/components/AdminGuard";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <MasterCourse />
      </AdminGuard>
    </Suspense>
  );
}
