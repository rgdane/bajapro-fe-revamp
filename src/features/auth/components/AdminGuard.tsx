"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { authServices } from "../services/authServices";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const profile = await authServices.getProfile();
      if (!active) return;
      if (profile?.role === "admin") {
        setAllowed(true);
      } else {
        setAllowed(false);
        router.replace("/manage-user/user");
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  if (allowed !== true) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}

export default AdminGuard;
