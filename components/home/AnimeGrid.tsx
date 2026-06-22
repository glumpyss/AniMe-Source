"use client";
import { motion } from "framer-motion";
import { JikanAnime } from "@/lib/jikan";
import AnimeCard from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/Skeleton";

interface Props {
  title: string;
  subtitle?: string;
  animes: JikanAnime[];
  loading?: boolean;
}

export default function AnimeGrid({ title, subtitle, animes, loading }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <motion.h2
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : animes.map((anime, i) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={i} />
            ))}
      </div>
    </section>
  );
}
