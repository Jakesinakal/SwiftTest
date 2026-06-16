import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import swift from "@shikijs/langs/swift";
import githubDark from "@shikijs/themes/github-dark";

// Hanya grammar Swift + tema github-dark yang dimuat (bukan bundle penuh Shiki),
// dengan engine regex JavaScript sehingga tidak perlu memuat WASM oniguruma.
// Highlighter dibuat sekali lalu dipakai ulang untuk semua snippet (lebih hemat).
let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubDark],
      langs: [swift],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

/** Ubah kode Swift menjadi HTML berwarna (dijalankan di server saat build). */
export async function highlightSwift(code: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, { lang: "swift", theme: "github-dark" });
}
