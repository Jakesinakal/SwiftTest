"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DURATION_SECONDS, TOTAL_DRAW } from "@/lib/questions";
import {
  buildSession,
  type PreparedSection,
  type SessionQuestion,
} from "@/lib/session";
import CodeBlock from "./CodeBlock";
import Timer from "./Timer";
import ExamResults from "./ExamResults";

type Status = "idle" | "running" | "finished";

/** Kelompok soal berurutan per section, lengkap dengan index globalnya. */
type NavGroup = { sectionId: string; sectionName: string; start: number; count: number };

function groupBySection(session: SessionQuestion[]): NavGroup[] {
  const groups: NavGroup[] = [];
  session.forEach((q, i) => {
    const last = groups[groups.length - 1];
    if (last && last.sectionId === q.sectionId) {
      last.count++;
    } else {
      groups.push({ sectionId: q.sectionId, sectionName: q.sectionName, start: i, count: 1 });
    }
  });
  return groups;
}

export default function ExamClient({ sections }: { sections: PreparedSection[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [session, setSession] = useState<SessionQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);

  const total = session.length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const usedSeconds = DURATION_SECONDS - timeLeft;

  // Waktu habis -> otomatis selesai. Diturunkan saat render (bukan lewat effect)
  // agar tidak memicu render berantai.
  const effectiveStatus: Status =
    status === "running" && timeLeft === 0 ? "finished" : status;

  const start = useCallback(() => {
    const s = buildSession(sections);
    setSession(s);
    setAnswers(Array(s.length).fill(null));
    setCurrent(0);
    setTimeLeft(DURATION_SECONDS);
    setStatus("running");
  }, [sections]);

  const finish = useCallback(() => setStatus("finished"), []);

  const submitWithConfirm = useCallback(() => {
    const unanswered = answers.filter((a) => a === null).length;
    const ok =
      unanswered === 0 ||
      window.confirm(
        `Masih ada ${unanswered} soal yang belum dijawab. Yakin ingin menyelesaikan tes?`,
      );
    if (ok) finish();
  }, [answers, finish]);

  // Hitung mundur saat tes berjalan.
  useEffect(() => {
    if (effectiveStatus !== "running") return;
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [effectiveStatus]);

  // Cegah peserta tidak sengaja menutup / reload halaman saat tes berjalan.
  useEffect(() => {
    if (effectiveStatus !== "running") return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [effectiveStatus]);

  const choose = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  };

  if (effectiveStatus === "idle") return <StartScreen sections={sections} onStart={start} />;

  if (effectiveStatus === "finished") {
    return (
      <ExamResults
        session={session}
        answers={answers}
        usedSeconds={usedSeconds}
        onRetry={start}
      />
    );
  }

  // status === "running"
  const q = session[current];
  const selected = answers[current];
  const navGroups = groupBySection(session);

  return (
    <div className="flex flex-1 flex-col">
      {/* Header lengket: section + timer + progres */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-stone-50/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold uppercase tracking-wide text-swift">
              {q.sectionName}
            </div>
            <div className="text-sm font-medium text-stone-600 dark:text-stone-300">
              Soal{" "}
              <span className="font-bold text-stone-900 dark:text-stone-50">{current + 1}</span> /{" "}
              {total}
              <span className="ml-2 hidden text-stone-400 sm:inline">
                · {answeredCount} terjawab
              </span>
            </div>
          </div>
          <Timer seconds={timeLeft} />
        </div>
        <div className="h-1 w-full bg-stone-200 dark:bg-stone-800">
          <div
            className="h-full bg-swift transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <p className="text-lg font-semibold text-stone-900 dark:text-stone-50">{q.prompt}</p>

        {q.codeHtml && (
          <div className="mt-4">
            <CodeBlock html={q.codeHtml} />
          </div>
        )}

        <ul className="mt-6 space-y-3">
          {q.options.map((opt, oi) => {
            const isSelected = selected === oi;
            return (
              <li key={oi}>
                <button
                  onClick={() => choose(oi)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors",
                    isSelected
                      ? "border-swift bg-swift/5 dark:bg-swift/10"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 dark:hover:bg-stone-800",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                      isSelected
                        ? "border-swift bg-swift text-white"
                        : "border-stone-300 text-stone-500 dark:border-stone-600 dark:text-stone-400",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <span className="text-stone-800 dark:text-stone-100">{opt.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </main>

      {/* Navigator soal, dikelompokkan per section */}
      <footer className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto w-full max-w-3xl px-4 py-4">
          <div className="mb-4 space-y-3">
            {navGroups.map((g) => (
              <div key={g.sectionId}>
                <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
                  {g.sectionName}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: g.count }, (_, k) => {
                    const i = g.start + k;
                    const isCurrent = i === current;
                    const isAnswered = answers[i] !== null;
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Ke soal ${i + 1}`}
                        className={[
                          "h-9 w-9 rounded-lg text-sm font-semibold tabular-nums transition-colors",
                          isCurrent
                            ? "bg-swift text-white ring-2 ring-swift ring-offset-2 ring-offset-white dark:ring-offset-stone-900"
                            : isAnswered
                              ? "bg-swift/15 text-swift dark:bg-swift/20"
                              : "bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700",
                        ].join(" ")}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="rounded-lg border border-stone-300 px-5 py-2 font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              ← Sebelumnya
            </button>

            {current < total - 1 ? (
              <button
                onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
                className="rounded-lg bg-stone-900 px-5 py-2 font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300"
              >
                Berikutnya →
              </button>
            ) : (
              <button
                onClick={submitWithConfirm}
                className="rounded-lg bg-swift px-6 py-2 font-semibold text-white transition-colors hover:bg-swift-dark"
              >
                Selesai & Lihat Hasil
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function StartScreen({
  sections,
  onStart,
}: {
  sections: PreparedSection[];
  onStart: () => void;
}) {
  const hours = DURATION_SECONDS / 3600;
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Siap memulai tes?</h1>
        <p className="mt-3 text-stone-600 dark:text-stone-300">
          Uji kemampuan logika & dasar pemrogramanmu. Baca tiap soal dengan teliti.
        </p>

        <ul className="mt-6 space-y-3 text-left">
          <Rule>
            <strong>{TOTAL_DRAW} soal</strong> pilihan ganda (A–D) dalam {sections.length} bagian:
          </Rule>
          {sections.map((s) => (
            <Rule key={s.id}>
              {s.name} — <strong>{s.drawCount} soal</strong>
            </Rule>
          ))}
          <Rule>
            Batas waktu <strong>{hours} jam</strong> — habis waktu otomatis dikumpulkan
          </Rule>
          <Rule>Soal berbahasa Inggris</Rule>
          <Rule>Bisa maju-mundur dan mengubah jawaban sebelum selesai</Rule>
          <Rule>Kunci jawaban & pembahasan muncul setelah tes selesai</Rule>
        </ul>

        <button
          onClick={onStart}
          className="mt-8 w-full rounded-xl bg-swift px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-swift-dark"
        >
          Mulai Tes
        </button>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
        >
          ← Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-stone-700 dark:text-stone-200">
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-swift"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
