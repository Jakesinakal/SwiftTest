import type { Question } from "./questions";
import { shuffle } from "./shuffle";

/** Soal yang sudah dilengkapi HTML kode hasil highlight (dari server). */
export type PreparedQuestion = Question & { codeHtml: string | null };

/** Satu section yang soal-soalnya sudah di-highlight di server. */
export type PreparedSection = {
  id: string;
  name: string;
  drawCount: number;
  questions: PreparedQuestion[];
};

export type SessionOption = { text: string; isCorrect: boolean };

/** Soal dalam satu sesi tes: urutan & pilihannya sudah diacak. */
export type SessionQuestion = {
  id: number;
  sectionId: string;
  sectionName: string;
  prompt: string;
  codeHtml: string | null;
  options: SessionOption[];
  explanation: string;
};

/**
 * Bangun satu sesi tes. Per section: acak bank lalu ambil `drawCount` soal,
 * dan acak pilihan tiap soal. Section tetap berurutan (Logic dulu, lalu
 * Dasar Pemrograman) sehingga soal terkelompok per section.
 */
export function buildSession(sections: PreparedSection[]): SessionQuestion[] {
  return sections.flatMap((section) =>
    shuffle(section.questions)
      .slice(0, section.drawCount)
      .map((q) => ({
        id: q.id,
        sectionId: section.id,
        sectionName: section.name,
        prompt: q.prompt,
        codeHtml: q.codeHtml,
        explanation: q.explanation,
        options: shuffle(
          q.options.map((text, i) => ({ text, isCorrect: i === q.correctIndex })),
        ),
      })),
  );
}
