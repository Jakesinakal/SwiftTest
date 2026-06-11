import type { Question } from "./questions";
import { shuffle } from "./shuffle";

/** Soal yang sudah dilengkapi HTML kode hasil highlight (dari server). */
export type PreparedQuestion = Question & { codeHtml: string | null };

export type SessionOption = { text: string; isCorrect: boolean };

/** Soal dalam satu sesi tes: urutan & pilihannya sudah diacak. */
export type SessionQuestion = {
  id: number;
  prompt: string;
  codeHtml: string | null;
  options: SessionOption[];
  explanation: string;
};

/** Bangun satu sesi tes: acak urutan soal dan acak pilihan tiap soal. */
export function buildSession(questions: PreparedQuestion[]): SessionQuestion[] {
  return shuffle(questions).map((q) => ({
    id: q.id,
    prompt: q.prompt,
    codeHtml: q.codeHtml,
    explanation: q.explanation,
    options: shuffle(
      q.options.map((text, i) => ({ text, isCorrect: i === q.correctIndex })),
    ),
  }));
}
