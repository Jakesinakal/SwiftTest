import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Model caching baru (PPR): halaman di-prerender sebagai static shell.
  cacheComponents: true,
  // Auto-memoization komponen React — UI ujian tidak ikut re-render tiap detik timer.
  reactCompiler: true,
};

export default nextConfig;
