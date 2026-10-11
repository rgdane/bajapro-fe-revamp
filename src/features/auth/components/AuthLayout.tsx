"use client";

import React from "react";
import Image from "next/image";

export interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout halaman auth: banner (kiri, md+) + konten form (kanan).
 *
 * Tinggi banner dikunci 100vh (bukan mengikuti tinggi form) supaya crop
 * `object-cover` tidak berubah saat jumlah field form bertambah/berkurang.
 * Sisi kanan scroll internal saat form lebih tinggi dari layar.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex md:h-screen md:overflow-hidden">
      {/* Banner kiri (hanya layar md ke atas) */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <Image
          src="/assets/login-img.png"
          alt="BAJAPRO"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#5B21B6]/95 via-[#6D28D9]/85 to-[#7C3AED]/80" />
        <div className="relative z-10 flex flex-col justify-center px-14 text-white">
          <span className="text-3xl font-black tracking-tight mb-4">BAJAPRO</span>
          <h2 className="text-2xl font-bold leading-snug mb-3 max-w-sm">
            Kuasai Pemrograman Java bersama BAJAPRO
          </h2>
          <p className="text-sm text-white/80 leading-relaxed max-w-sm font-medium">
            Platform e-learning Java dengan compiler terintegrasi, materi
            terstruktur, dan latihan interaktif.
          </p>
        </div>
      </div>

      {/* Konten kanan (scroll internal saat form tinggi) */}
      <div className="flex-1 bg-white md:overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
