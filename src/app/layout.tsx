import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AntdProvider from "@/components/providers/AntdProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BAJAPRO - E-Learning Java",
  description: "Aplikasi E-Learning Java",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full font-sans"
        style={{ backgroundColor: "#F4F4F4" }}
      >
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
