"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Star } from "lucide-react";
import { JikanAnime } from "@/lib/jikan";
import { formatScore } from "@/lib/utils";

interface Props {
  animes: JikanAnime[];
}

export default function UpcomingSection({ animes }: Props) {
  if (!animes.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-white">📅 Upcoming Anime</h2>
        <p className="text-sm text-white/40 mt-1">Coming soon to your watchlist</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {animes.slice(0, 6).map((anime, i) => {
          const img = anime.images.webp?.large_image_url || anime.images.jpg.large_image_url;
          return (
            <motion.div
              key={anime.mal_id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Link href={`/anime/${anime.mal_id}`} className="group flex gap-4 glass rounded-2xl p-3 hover:ring-1 hover:ring-purple-500/40 transition-all">
                <div className="relative w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
                  <Image src={img} alt={anime.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="font-semibold text-white line-clamp-2 text-sm group-hover:text-purple-300 transition-colors leading-snug">
                    {anime.title_english || anime.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-white/40">
                    {anime.score && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-yellow-400" />{formatScore(anime.score)}
                      </span>
                    )}
                    {anime.year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-purple-400" />{anime.year}
                      </span>
                    )}
                    {anime.type && <span>{anime.type}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {anime.genres?.slice(0, 2).map((g) => (
                      <span key={g.mal_id} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/20 text-purple-300/70">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
