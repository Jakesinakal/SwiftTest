function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Timer({ seconds }: { seconds: number }) {
  const danger = seconds <= 60;
  const warning = seconds <= 5 * 60 && !danger;

  return (
    <div
      className={[
        "flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-base font-semibold tabular-nums tracking-tight transition-colors",
        danger
          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse"
          : warning
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
      ].join(" ")}
      aria-label="Sisa waktu"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      {format(seconds)}
    </div>
  );
}
