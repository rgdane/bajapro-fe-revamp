import React, { Suspense } from "react";
import MasterSchool from "@/features/school/components/MasterSchool";
import { AdminGuard } from "@/features/auth/components/AdminGuard";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <MasterSchool />
      </AdminGuard>
    </Suspense>
  );
}
