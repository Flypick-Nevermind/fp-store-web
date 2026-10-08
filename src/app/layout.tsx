import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLYPICK | China-to-Indonesia Cross-Border Jastip & Freight Hub",
  description:
    "Layanan jasa titip (Jastip) dan forwarding barang dari Taobao, Tmall, dan 1688 Tiongkok ke Indonesia. Tarif transparan, bebas redline, photo QC di Shanghai, dan konsolidasi paket.",
  keywords: [
    "jastip china",
    "forwarding taobao",
    "jasa import 1688",
    "gudang shanghai",
    "cargo china indonesia",
    "flypick",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0F172A] antialiased">
        <QueryProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
