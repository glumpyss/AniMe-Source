"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { searchAnime, getGenres, JikanAnime } from "@/lib/jikan";
import { SEASONS, STATUS_OPTIONS, yearRange } from "@/lib/utils";
import AnimeCard from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/Skeleton";

const SCORE_OPTIONS = [
  { label: "Any Score", value: "" },
  { label: "9+ Masterpiece", value: "9" },
  { label: "8+ Great", value: "8" },
  { label: "7+ Good", value: "7" },
  { label: "6+ Fine", value: "6" },
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [season, setSeason] = useState(searchParams.get("season") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [minScore, setMinScore] = useState(searchParams.get("score") || "");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [genres, setGenres] = useState<{ mal_id: number; name: string }[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  // Load genre list
  useEffect(() => {
    getGenres().then((r) => setGenres(r.data)).catch(() => {});
  }, []);

  const doSearch = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params: Parameters<typeof searchAnime>[0] = {
        limit: 20,
        page: pg,
        order_by: "score",
      };
      if (query.trim()) params.q = query.trim();
      if (genre) params.genres = genre;
      if (season) params.season = season;
      if (year) params.year = Number(year);
      if (status) params.status = status;
      if (minScore) params.min_score = Number(minScore);

      const res = await searchAnime(params);
      setResults(res.data);
      setHasNext(res.pagination?.has_next_page ?? false);
      setTotalResults(res.pagination?.items?.total ?? res.data.length);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, genre, season, year, status, minScore]);

  // Search on param change
  useEffect(() => {
    const initial = searchParams.get("q") || "";
    setQuery(initial);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
    doSearch(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre, season, year, status, minScore]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    doSearch(1);
    // Update URL
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (genre) params.set("genre", genre);
    if (season) params.set("season", season);
    if (year) params.set("year", year);
    if (status) params.set("status", status);
    if (minScore) params.set("score", minScore);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const changePage = (newPage: number) => {
    setPage(newPage);
    doSearch(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setGenre(""); setSeason(""); setYear(""); setStatus(""); setMinScore("");
  };

  const hasActiveFilters = genre || season || year || status || minScore;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold text-white mb-2">Discover Anime</h1>
        <p className="text-white/40">Search and filter from thousands of titles</p>
      </motion.div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all ${
              showFilters || hasActiveFilters
                ? "bg-purple-600/30 border-purple-500/50 text-purple-300"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-purple-400" />}
          </button>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-medium hover:from-purple-500 hover:to-violet-500 transition-all active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-3xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">Filters</span>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  <option value="">All Genres</option>
                  {genres.map((g) => (
                    <option key={g.mal_id} value={g.mal_id} className="bg-[#1a1a2e]">{g.name}</option>
                  ))}
                </select>

                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  <option value="">All Seasons</option>
                  {SEASONS.map((s) => (
                    <option key={s} value={s} className="bg-[#1a1a2e] capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  <option value="">All Years</option>
                  {yearRange(1980).map((y) => (
                    <option key={y} value={y} className="bg-[#1a1a2e]">{y}</option>
                  ))}
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  <option value="">All Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-[#1a1a2e] capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>

                <select
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  {SCORE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#1a1a2e]">{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      {!loading && results.length > 0 && (
        <p className="text-sm text-white/40 mb-4">
          Showing {results.length} of {totalResults.toLocaleString()} results
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => <AnimeCardSkeleton key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {results.map((anime, i) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={i} />
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => changePage(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="px-4 py-2.5 text-sm text-white/60">
              Page <span className="text-white font-semibold">{page}</span>
            </span>
            <button
              onClick={() => changePage(page + 1)}
              disabled={!hasNext}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          {loading ? (
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white/40 text-lg mb-2">No results found</p>
              <p className="text-white/20 text-sm">Try different keywords or adjust your filters</p>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
