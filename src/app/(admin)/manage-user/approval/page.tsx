import React, { Suspense } from "react";
import MasterApproval from "@/features/approval/components/MasterApproval";
import { AdminGuard } from "@/features/auth/components/AdminGuard";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminGuard>
        <MasterApproval />
      </AdminGuard>
    </Suspense>
  );
}
