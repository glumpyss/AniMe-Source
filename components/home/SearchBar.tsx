"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const suggestions = ["Attack on Titan", "Naruto", "One Piece", "Demon Slayer", "My Hero Academia"];

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">Discover</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Find Your Next Favorite</h2>
        <p className="text-white/40">Search from thousands of anime titles</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <div className={`relative rounded-3xl transition-all duration-300 ${
            focused
              ? "ring-2 ring-purple-500/50 shadow-xl shadow-purple-500/10"
              : "ring-1 ring-white/10"
          }`}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search anime titles, genres, studios..."
              className="w-full bg-white/5 backdrop-blur-sm rounded-3xl pl-14 pr-32 py-4 text-white placeholder-white/25 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-medium hover:from-purple-500 hover:to-violet-500 transition-all active:scale-95"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <span className="text-xs text-white/30">Popular:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
              className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/30 text-white/50 hover:text-purple-300 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
