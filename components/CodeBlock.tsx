/**
 * Menampilkan kode Swift yang sudah di-highlight oleh Shiki (di server).
 * `html` adalah markup <pre> hasil Shiki, jadi aman dirender langsung.
 */
export default function CodeBlock({
  html,
  className = "overflow-hidden rounded-lg ring-1 ring-stone-700/50 [&_pre]:!m-0",
}: {
  html: string | null;
  className?: string;
}) {
  if (!html) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
