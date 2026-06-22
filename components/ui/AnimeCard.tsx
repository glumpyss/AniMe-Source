"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Play } from "lucide-react";
import { JikanAnime } from "@/lib/jikan";
import { cn, formatScore, getScoreColor } from "@/lib/utils";

interface Props {
  anime: JikanAnime;
  index?: number;
  size?: "sm" | "md" | "lg";
  showRank?: boolean;
}

export default function AnimeCard({ anime, index = 0, size = "md", showRank }: Props) {
  const img =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    "/placeholder.jpg";

  const sizeClasses = {
    sm: "w-36",
    md: "w-44",
    lg: "w-52",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn("group relative flex-shrink-0", sizeClasses[size])}
    >
      <Link href={`/anime/${anime.mal_id}`}>
        <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-white/5">
          <Image
            src={img}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 140px, 208px"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-500/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Score badge */}
          {anime.score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className={getScoreColor(anime.score)}>{formatScore(anime.score)}</span>
            </div>
          )}

          {/* Rank badge */}
          {showRank && anime.rank && (
            <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
              #{anime.rank}
            </div>
          )}

          {/* Bottom info (on hover) */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-wrap gap-1">
              {anime.genres?.slice(0, 2).map((g) => (
                <span key={g.mal_id} className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-600/80 text-white">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 px-1">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors">
            {anime.title_english || anime.title}
          </h3>
          {anime.year && (
            <p className="text-xs text-gray-500 mt-0.5">{anime.year} · {anime.type || "TV"}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
