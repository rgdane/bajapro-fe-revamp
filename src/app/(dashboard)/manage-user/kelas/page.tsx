import React, { Suspense } from "react";
import MasterKelas from "@/features/kelas/components/MasterKelas";
import { AdminGuard } from "@/features/auth/components/AdminGuard";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <MasterKelas />
      </AdminGuard>
    </Suspense>
  );
}
