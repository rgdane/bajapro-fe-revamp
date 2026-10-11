import React from "react";
import Link from "next/link";
import { Button, Card, Result } from "antd";

export default function WaitingApprovalPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card style={{ width: 480, borderRadius: 12 }}>
        <Result
          status="info"
          title="Menunggu Persetujuan Admin"
          subTitle="Pendaftaran akun guru Anda berhasil dikirim. Akun akan aktif setelah disetujui admin. Silakan kembali lagi nanti."
          extra={
            <Link href="/login">
              <Button type="primary" style={{ backgroundColor: "#7246BA" }}>
                Ke Halaman Login
              </Button>
            </Link>
          }
        />
      </Card>
    </div>
  );
}
