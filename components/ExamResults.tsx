import Link from "next/link";
import type { SessionQuestion } from "@/lib/session";
import CodeBlock from "./CodeBlock";

type Props = {
  session: SessionQuestion[];
  answers: (number | null)[];
  usedSeconds: number;
  onRetry: () => void;
};

/** Item soal beserta index globalnya (untuk lookup ke array `answers`). */
type GroupItem = { q: SessionQuestion; i: number };
type SectionGroup = { sectionId: string; sectionName: string; items: GroupItem[] };

function groupBySection(session: SessionQuestion[]): SectionGroup[] {
  const groups: SectionGroup[] = [];
  session.forEach((q, i) => {
    const last = groups[groups.length - 1];
    if (last && last.sectionId === q.sectionId) {
      last.items.push({ q, i });
    } else {
      groups.push({ sectionId: q.sectionId, sectionName: q.sectionName, items: [{ q, i }] });
    }
  });
  return groups;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [];
  if (h > 0) parts.push(`${h} jam`);
  parts.push(`${m} menit`);
  parts.push(`${s.toString().padStart(2, "0")} detik`);
  return parts.join(" ");
}

/** Render teks dengan `inline code` di antara backtick menjadi elemen <code>. */
function renderInline(text: string) {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded bg-stone-200 px-1 py-0.5 font-mono text-[0.85em] text-stone-800 dark:bg-stone-700 dark:text-stone-100"
      >
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function verdict(percent: number): { label: string; color: string } {
  if (percent >= 80)
    return { label: "Luar biasa! 🎉", color: "text-green-600 dark:text-green-400" };
  if (percent >= 60)
    return { label: "Bagus, terus berlatih! 👍", color: "text-swift" };
  if (percent >= 40)
    return { label: "Lumayan, masih bisa lebih baik.", color: "text-amber-600 dark:text-amber-400" };
  return { label: "Ayo pelajari lagi dasarnya. 💪", color: "text-red-600 dark:text-red-400" };
}

export default function ExamResults({ session, answers, usedSeconds, onRetry }: Props) {
  const isCorrectAt = (i: number) => {
    const a = answers[i];
    return a !== null && (session[i].options[a]?.isCorrect ?? false);
  };

  const correctCount = session.reduce((acc, _q, i) => acc + (isCorrectAt(i) ? 1 : 0), 0);
  const total = session.length;
  const unanswered = answers.filter((a) => a === null).length;
  const wrong = total - correctCount - unanswered;
  const percent = Math.round((correctCount / total) * 100);
  const v = verdict(percent);

  const groups = groupBySection(session);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      {/* Ringkasan skor */}
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <p className="text-sm font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          Hasil Tes
        </p>
        <div className="mt-3 flex items-baseline justify-center gap-1">
          <span className="text-6xl font-bold tabular-nums text-stone-900 dark:text-stone-50">
            {correctCount}
          </span>
          <span className="text-2xl font-medium text-stone-400">/ {total}</span>
        </div>
        <p className={`mt-2 text-lg font-semibold ${v.color}`}>
          {percent}% — {v.label}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-green-50 py-3 dark:bg-green-950/40">
            <div className="text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
              {correctCount}
            </div>
            <div className="text-stone-500 dark:text-stone-400">Benar</div>
          </div>
          <div className="rounded-lg bg-red-50 py-3 dark:bg-red-950/40">
            <div className="text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
              {wrong}
            </div>
            <div className="text-stone-500 dark:text-stone-400">Salah</div>
          </div>
          <div className="rounded-lg bg-stone-100 py-3 dark:bg-stone-800">
            <div className="text-2xl font-bold tabular-nums text-stone-600 dark:text-stone-300">
              {unanswered}
            </div>
            <div className="text-stone-500 dark:text-stone-400">Kosong</div>
          </div>
        </div>

        {/* Skor per section */}
        <div className="mt-4 space-y-2 text-sm">
          {groups.map((g) => {
            const benar = g.items.reduce((acc, { i }) => acc + (isCorrectAt(i) ? 1 : 0), 0);
            return (
              <div
                key={g.sectionId}
                className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-2 dark:bg-stone-800/60"
              >
                <span className="font-medium text-stone-700 dark:text-stone-200">{g.sectionName}</span>
                <span className="tabular-nums text-stone-500 dark:text-stone-400">
                  {benar} / {g.items.length} benar
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-sm text-stone-500 dark:text-stone-400">
          Waktu pengerjaan: {formatDuration(usedSeconds)}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={onRetry}
            className="rounded-lg bg-swift px-6 py-2.5 font-semibold text-white transition-colors hover:bg-swift-dark"
          >
            Ulangi Tes
          </button>
          <Link
            href="/"
            className="rounded-lg border border-stone-300 px-6 py-2.5 font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Ke Beranda
          </Link>
        </div>
      </div>

      {/* Pembahasan, dikelompokkan per section */}
      <h2 className="mt-10 mb-4 text-xl font-bold text-stone-900 dark:text-stone-50">
        Pembahasan Jawaban
      </h2>

      {groups.map((g) => {
        const benar = g.items.reduce((acc, { i }) => acc + (isCorrectAt(i) ? 1 : 0), 0);
        return (
          <section key={g.sectionId} className="mb-8">
            <div className="mb-4 flex items-baseline justify-between border-b border-stone-200 pb-2 dark:border-stone-800">
              <h3 className="text-lg font-bold text-swift">{g.sectionName}</h3>
              <span className="text-sm tabular-nums text-stone-500 dark:text-stone-400">
                {benar} / {g.items.length} benar
              </span>
            </div>

            <div className="space-y-5">
              {g.items.map(({ q, i }) => {
                const answer = answers[i];
                const isCorrect = answer !== null && q.options[answer]?.isCorrect;
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                          isCorrect ? "bg-green-600" : answer === null ? "bg-stone-400" : "bg-red-600",
                        ].join(" ")}
                      >
                        {i + 1}
                      </span>
                      <p className="font-medium text-stone-900 dark:text-stone-100">{q.prompt}</p>
                    </div>

                    {q.codeHtml && (
                      <div className="mt-3">
                        <CodeBlock html={q.codeHtml} />
                      </div>
                    )}

                    <ul className="mt-4 space-y-2">
                      {q.options.map((opt, oi) => {
                        const chosen = answer === oi;
                        const correct = opt.isCorrect;
                        return (
                          <li
                            key={oi}
                            className={[
                              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                              correct
                                ? "border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
                                : chosen
                                  ? "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                                  : "border-stone-200 text-stone-600 dark:border-stone-800 dark:text-stone-400",
                            ].join(" ")}
                          >
                            <span>{opt.text}</span>
                            {correct && (
                              <span className="ml-auto shrink-0 font-semibold">✓ Jawaban benar</span>
                            )}
                            {chosen && !correct && (
                              <span className="ml-auto shrink-0 font-semibold">✗ Jawabanmu</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {answer === null && (
                      <p className="mt-3 text-sm italic text-stone-400">Tidak dijawab.</p>
                    )}

                    <div className="mt-4 rounded-lg bg-stone-50 p-3 text-sm leading-relaxed text-stone-700 dark:bg-stone-800/60 dark:text-stone-300">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        Penjelasan:{" "}
                      </span>
                      {renderInline(q.explanation)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
