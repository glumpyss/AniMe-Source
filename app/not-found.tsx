import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="text-[12rem] font-black leading-none select-none"
          style={{
            background: "linear-gradient(135deg, #8B5CF6, #A855F7, #6D28D9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>
        <div className="absolute inset-0 blur-3xl bg-purple-600/20 rounded-full -z-10" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-white/40 mb-8 max-w-sm">
        This anime arc doesn&apos;t exist yet. Head back and find something great to watch.
      </p>

      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium hover:from-purple-500 hover:to-violet-500 transition-all active:scale-95 shadow-lg shadow-purple-500/25"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium transition-all active:scale-95"
        >
          <Search className="w-4 h-4" />
          Discover
        </Link>
      </div>
    </div>
  );
}
