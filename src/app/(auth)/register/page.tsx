import React, { Suspense } from "react";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
