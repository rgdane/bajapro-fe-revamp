import React, { Suspense } from "react";
import MasterLevel from "@/features/level/components/MasterLevel";
import { AdminGuard } from "@/features/auth/components/AdminGuard";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <MasterLevel />
      </AdminGuard>
    </Suspense>
  );
}
