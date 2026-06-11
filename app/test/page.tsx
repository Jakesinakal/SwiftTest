import type { Metadata } from "next";
import { questions } from "@/lib/questions";
import { highlightSwift } from "@/lib/highlight";
import { type PreparedQuestion } from "@/lib/session";
import ExamClient from "@/components/ExamClient";

export const metadata: Metadata = {
  title: "Tes Swift — Sedang Berlangsung",
};

export default async function TestPage() {
  // Highlight semua snippet kode di server (dijalankan sekali saat build).
  const prepared: PreparedQuestion[] = await Promise.all(
    questions.map(async (q) => ({
      ...q,
      codeHtml: q.code ? await highlightSwift(q.code) : null,
    })),
  );

  return <ExamClient questions={prepared} />;
}
