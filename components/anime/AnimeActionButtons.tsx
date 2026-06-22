"use client";
import { Heart, Bookmark, Play } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store";
import { JikanAnime } from "@/lib/jikan";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AnimeActionButtons({ anime }: { anime: JikanAnime }) {
  const { isFavorite, addFavorite, removeFavorite, isInWatchlist, addToWatchlist, removeFromWatchlist } = useUserStore();

  const fav = isFavorite(anime.mal_id);
  const inList = isInWatchlist(anime.mal_id);

  return (
    <div className="flex flex-wrap gap-3">
      <Link href={`/watch/${anime.mal_id}/1`}>
        <Button size="lg" variant="primary">
          <Play className="w-5 h-5 fill-white" />
          Watch Now
        </Button>
      </Link>

      <button
        onClick={() => fav ? removeFavorite(anime.mal_id) : addFavorite(anime)}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all duration-200 active:scale-95",
          fav
            ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
            : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
        )}
      >
        <Heart className={cn("w-4 h-4", fav && "fill-red-400")} />
        {fav ? "Favorited" : "Favorite"}
      </button>

      <button
        onClick={() => inList ? removeFromWatchlist(anime.mal_id) : addToWatchlist(anime)}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all duration-200 active:scale-95",
          inList
            ? "bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30"
            : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
        )}
      >
        <Bookmark className={cn("w-4 h-4", inList && "fill-purple-400")} />
        {inList ? "In Watchlist" : "Watchlist"}
      </button>
    </div>
  );
}
