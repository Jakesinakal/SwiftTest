import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TOTAL_DRAW } from "@/lib/questions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tes Logika & Dasar Pemrograman",
  description: `Latihan kemampuan logika dan dasar pemrograman lewat ${TOTAL_DRAW} soal pilihan ganda dengan timer dan pembahasan lengkap.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-stone-50 font-sans text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        {children}
      </body>
    </html>
  );
}
