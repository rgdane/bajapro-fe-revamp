import React, { Suspense } from "react";
import MasterUser from "@/features/user/components/MasterUser";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MasterUser />
    </Suspense>
  );
}
