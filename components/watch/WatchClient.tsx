"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, List, Info, ExternalLink } from "lucide-react";
import { JikanAnime, JikanEpisode } from "@/lib/jikan";
import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface Props {
  anime: JikanAnime;
  episodes: JikanEpisode[];
  currentEpisode: number;
}

export default function WatchClient({ anime, episodes, currentEpisode }: Props) {
  const router = useRouter();
  const [showList, setShowList] = useState(true);
  const { addRecentlyWatched, setWatchProgress, getWatchProgress } = useUserStore();
  const totalEps = anime.episodes || episodes.length || 100;

  useEffect(() => {
    addRecentlyWatched(anime);
  }, [anime, addRecentlyWatched]);

  const currentEpInfo = episodes.find((e) => e.mal_id === currentEpisode);
  const trailerYt = anime.trailer?.youtube_id;

  const goToEpisode = (ep: number) => {
    if (ep < 1 || ep > totalEps) return;
    router.push(`/watch/${anime.mal_id}/${ep}`);
  };

  // Generate episode list if API didn't return them
  const epList: { id: number; title: string; filler?: boolean; recap?: boolean }[] = episodes.length > 0
    ? episodes.map((e) => ({ id: e.mal_id, title: e.title || `Episode ${e.mal_id}`, filler: e.filler, recap: e.recap }))
    : Array.from({ length: Math.min(totalEps, 200) }, (_, i) => ({ id: i + 1, title: `Episode ${i + 1}` }));

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
          <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/anime/${anime.mal_id}`} className="hover:text-white/70 transition-colors">
            {anime.title_english || anime.title}
          </Link>
          <span>/</span>
          <span className="text-white/60">Episode {currentEpisode}</span>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Player area */}
          <div className="flex-1 min-w-0">
            {/* Video player */}
            <div className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10" style={{ aspectRatio: "16/9" }}>
              {trailerYt ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailerYt}?autoplay=0&rel=0&modestbranding=1`}
                  title={`${anime.title} - Episode ${currentEpisode}`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-black via-purple-950/20 to-black">
                  <Image
                    src={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url}
                    alt={anime.title}
                    fill
                    className="object-cover opacity-20"
                  />
                  <div className="relative z-10 text-center px-6">
                    <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                      <ExternalLink className="w-7 h-7 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Stream on Official Sites</h3>
                    <p className="text-white/40 text-sm mb-6 max-w-sm">
                      Free streaming sources aren&apos;t available through this API. Watch on Crunchyroll, Funimation, or other legal platforms.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {["Crunchyroll", "Funimation", "HiDive", "Netflix"].map((s) => (
                        <a
                          key={s}
                          href={`https://www.${s.toLowerCase()}.com/search?q=${encodeURIComponent(anime.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm text-white/70 hover:text-white transition-all"
                        >
                          {s}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Episode nav */}
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                onClick={() => goToEpisode(currentEpisode - 1)}
                disabled={currentEpisode <= 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-white/50">Episode</span>
                <span className="text-base font-bold text-white">{currentEpisode}</span>
                {totalEps > 0 && <span className="text-sm text-white/30">/ {totalEps}</span>}
              </div>

              <button
                onClick={() => goToEpisode(currentEpisode + 1)}
                disabled={currentEpisode >= totalEps}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Episode info */}
            {currentEpInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 glass rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white">{currentEpInfo.title}</h3>
                    {currentEpInfo.recap && <Badge variant="yellow" className="mt-1">Recap</Badge>}
                    {currentEpInfo.filler && <Badge variant="glass" className="mt-1 ml-1">Filler</Badge>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Anime info strip */}
            <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-4">
              <Image
                src={anime.images.webp?.image_url || anime.images.jpg.image_url}
                alt={anime.title}
                width={48}
                height={64}
                className="rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <Link href={`/anime/${anime.mal_id}`} className="font-semibold text-white hover:text-purple-300 transition-colors truncate block">
                  {anime.title_english || anime.title}
                </Link>
                <div className="flex flex-wrap gap-2 mt-1">
                  {anime.genres?.slice(0, 3).map((g) => (
                    <Badge key={g.mal_id} variant="outline">{g.name}</Badge>
                  ))}
                </div>
              </div>
              <Link href={`/anime/${anime.mal_id}`} className="flex-shrink-0">
                <button className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 hover:text-white transition-all flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Details
                </button>
              </Link>
            </div>
          </div>

          {/* Episode list sidebar */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="glass rounded-3xl overflow-hidden h-full">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white text-sm">Episodes</span>
                  <span className="text-xs text-white/40">({epList.length})</span>
                </div>
                <button onClick={() => setShowList(!showList)} className="text-white/40 hover:text-white transition-colors text-xs">
                  {showList ? "Hide" : "Show"}
                </button>
              </div>

              {showList && (
                <div className="overflow-y-auto max-h-[600px] p-2">
                  {epList.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => goToEpisode(ep.id)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 group",
                        currentEpisode === ep.id
                          ? "bg-purple-600/30 border border-purple-500/40 text-white"
                          : "hover:bg-white/5 border border-transparent text-white/60 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-xs font-mono w-8 flex-shrink-0",
                          currentEpisode === ep.id ? "text-purple-300" : "text-white/30"
                        )}>
                          {String(ep.id).padStart(2, "0")}
                        </span>
                        <span className="text-sm truncate">{ep.title}</span>
                        {ep.filler && <span className="text-[10px] text-yellow-400/60 flex-shrink-0">F</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
