import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntdProvider from "@/components/providers/AntdProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BAJAPRO - E-Learning Java",
  description: "Aplikasi E-Learning Java",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full font-sans"
        style={{ backgroundColor: "#F4F4F4" }}
      >
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
