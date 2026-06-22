"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { JikanAnime } from "@/lib/jikan";
import { formatScore } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface Props {
  animes: JikanAnime[];
}

export default function HeroSection({ animes }: Props) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || animes.length === 0) return;
    const t = setTimeout(() => setCurrent((c) => (c + 1) % animes.length), 6000);
    return () => clearTimeout(t);
  }, [current, isAutoPlaying, animes.length]);

  if (!animes.length) return null;

  const anime = animes[current];
  const bg =
    anime.trailer?.images?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    "";

  const prev = () => { setCurrent((c) => (c - 1 + animes.length) % animes.length); setIsAutoPlaying(false); };
  const next = () => { setCurrent((c) => (c + 1) % animes.length); setIsAutoPlaying(false); };

  return (
    <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={anime.mal_id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {bg && (
            <Image
              src={bg}
              alt={anime.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          <div className="absolute inset-0 animated-gradient opacity-40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={anime.mal_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                {/* Genre tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genres?.slice(0, 3).map((g) => (
                    <span key={g.mal_id} className="text-xs px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/30 text-purple-300">
                      {g.name}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                  {anime.title_english || anime.title}
                </h1>

                <div className="flex items-center gap-4 mb-5 text-sm text-white/60">
                  {anime.score && (
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      {formatScore(anime.score)}
                    </span>
                  )}
                  {anime.year && <span>{anime.year}</span>}
                  {anime.episodes && <span>{anime.episodes} eps</span>}
                  {anime.status && <span>{anime.status}</span>}
                </div>

                <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-3 mb-8 max-w-xl">
                  {anime.synopsis?.replace(/\[Written by.*?\]/g, "").trim()}
                </p>

                <div className="flex gap-3">
                  <Link href={`/watch/${anime.mal_id}/1`}>
                    <Button size="lg" variant="primary">
                      <Play className="w-5 h-5 fill-white" />
                      Watch Now
                    </Button>
                  </Link>
                  <Link href={`/anime/${anime.mal_id}`}>
                    <Button size="lg" variant="secondary">
                      <Info className="w-5 h-5" />
                      More Info
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {animes.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setIsAutoPlaying(false); }}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-purple-400" : "w-2 bg-white/30"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
