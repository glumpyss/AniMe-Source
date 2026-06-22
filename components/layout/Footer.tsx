import Link from "next/link";
import { Tv2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Tv2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">AniMe</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <Link href="/search" className="hover:text-white/70 transition-colors">Discover</Link>
            <Link href="/profile" className="hover:text-white/70 transition-colors">Profile</Link>
          </div>
          <p className="text-xs text-white/20">
            Powered by <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-purple-400/60 hover:text-purple-400">Jikan API</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
