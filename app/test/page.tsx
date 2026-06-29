import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { sections } from "@/lib/questions";
import { highlightSwift } from "@/lib/highlight";
import { type PreparedSection } from "@/lib/session";
import ExamClient from "@/components/ExamClient";

export const metadata: Metadata = {
  title: "Tes — Sedang Berlangsung",
};

export default async function TestPage() {
  "use cache";
  cacheLife("max"); // Soal statis — hanya berubah saat deploy.

  // Highlight semua snippet kode di server (dijalankan sekali saat build).
  const prepared: PreparedSection[] = await Promise.all(
    sections.map(async (section) => ({
      id: section.id,
      name: section.name,
      drawCount: section.drawCount,
      questions: await Promise.all(
        section.questions.map(async (q) => ({
          ...q,
          codeHtml: q.code ? await highlightSwift(q.code) : null,
        })),
      ),
    })),
  );

  return <ExamClient sections={prepared} />;
}
