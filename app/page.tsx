import Link from "next/link";
import { cacheLife } from "next/cache";
import { DURATION_SECONDS, TOTAL_DRAW, sections } from "@/lib/questions";
import { highlightSwift } from "@/lib/highlight";
import CodeBlock from "@/components/CodeBlock";

const HERO_SNIPPET = `struct Tes {
    let topik: String
    var skor = 0
    var sisaWaktu = 120  // menit, santai tapi tetap fokus ;)

    mutating func jawab(benar: Bool) {
        skor += benar ? 1 : 0
        // salah? gpp, yang penting nyoba :)
    }
}

var aku = Tes(topik: "Logika & Pemrograman")
aku.jawab(benar: true)

guard aku.skor > 0 else {
    fatalError("force unwrap ke nil, x_x")
}

print("Skor: \\(aku.skor) — gas terus, jangan nyerah!")`;

export default async function Home() {
  "use cache";
  cacheLife("max"); // Konten statis — hanya berubah saat deploy.

  const heroCodeHtml = await highlightSwift(HERO_SNIPPET);
  const hours = DURATION_SECONDS / 3600;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-16 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-swift">
        Latihan Tes Logika & Pemrograman
      </p>

      <h1 className="mt-6 text-center text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
        Tes Logika & Dasar Pemrograman
      </h1>

      <p className="mt-5 max-w-xl text-center text-lg text-stone-600 dark:text-stone-300">
        Wadah berlatih kemampuan penalaran logika dan dasar pemrograman. Kerjakan {TOTAL_DRAW}{" "}
        soal pilihan ganda dalam {sections.length} bagian, lalu pelajari pembahasan lengkapnya.
      </p>
      <p className="mt-2 text-center text-sm text-stone-500 dark:text-stone-400">
        Soal berbahasa Inggris.
      </p>

      <dl className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500 dark:text-stone-400">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xl font-bold text-stone-900 sm:text-2xl dark:text-stone-100">{sections.length}</dt>
          <dd>bagian</dd>
        </div>
        <span aria-hidden className="text-stone-300 dark:text-stone-700">
          ·
        </span>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xl font-bold text-stone-900 sm:text-2xl dark:text-stone-100">{TOTAL_DRAW}</dt>
          <dd>soal</dd>
        </div>
        <span aria-hidden className="text-stone-300 dark:text-stone-700">
          ·
        </span>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xl font-bold text-stone-900 sm:text-2xl dark:text-stone-100">{hours}</dt>
          <dd>jam</dd>
        </div>
        <span aria-hidden className="text-stone-300 dark:text-stone-700">
          ·
        </span>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xl font-bold text-stone-900 sm:text-2xl dark:text-stone-100">A–D</dt>
          <dd>pilihan</dd>
        </div>
      </dl>

      <Link
        href="/test"
        className="mt-10 rounded-xl bg-swift px-8 py-3.5 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-swift-dark"
      >
        Mulai Tes Sekarang
      </Link>

      {/* Cuplikan kode */}
      <div className="mt-16 w-full min-w-0 max-w-2xl overflow-hidden rounded-xl shadow-lg ring-1 ring-stone-900/10 dark:ring-stone-100/10">
        <div className="flex items-center gap-1.5 bg-[#0d1117] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 font-mono text-xs text-stone-400">Tes.swift</span>
        </div>
        <CodeBlock html={heroCodeHtml} className="[&_pre]:!m-0" />
      </div>
    </main>
  );
}
