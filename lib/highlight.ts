import { createHighlighter, type Highlighter } from "shiki";

// Highlighter dibuat sekali lalu dipakai ulang untuk semua snippet (lebih hemat).
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: ["swift"],
    });
  }
  return highlighterPromise;
}

/** Ubah kode Swift menjadi HTML berwarna (dijalankan di server saat build). */
export async function highlightSwift(code: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, { lang: "swift", theme: "github-dark" });
}
