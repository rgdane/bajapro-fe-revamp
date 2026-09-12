import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BAJAPRO - E-Learning Java",
  description: "Aplikasi E-Learning Java",
};

import Sidebar from "@/navigation/Sidebar";
import Header from "@/navigation/Header";
import Footer from "@/navigation/Footer";
import AntdProvider from "@/components/providers/AntdProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-row font-sans" style={{ backgroundColor: "#F4F4F4" }}>
        <AntdProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
            <Footer />
          </div>
        </AntdProvider>
      </body>
    </html>
  );
}
