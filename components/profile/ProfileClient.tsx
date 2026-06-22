"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, Clock, User } from "lucide-react";
import { useUserStore } from "@/lib/store";
import AnimeCard from "@/components/ui/AnimeCard";

const TABS = [
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "watchlist", label: "Watchlist", icon: Bookmark },
  { id: "recent", label: "Recently Watched", icon: Clock },
] as const;

type Tab = typeof TABS[number]["id"];

export default function ProfileClient() {
  const [tab, setTab] = useState<Tab>("favorites");
  const { favorites, watchlist, recentlyWatched } = useUserStore();

  const lists = {
    favorites,
    watchlist,
    recent: recentlyWatched,
  };

  const current = lists[tab];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shadow-xl shadow-purple-500/30">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Profile</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {favorites.length} favorites · {watchlist.length} in watchlist · {recentlyWatched.length} recently watched
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-2xl w-fit mb-8">
        {TABS.map((t) => {
          const Icon = t.icon;
          const count = lists[t.id].length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-white/20" : "bg-white/10"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {current.length === 0 ? (
            <div className="text-center py-24 glass rounded-3xl">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                {tab === "favorites" && <Heart className="w-7 h-7 text-white/20" />}
                {tab === "watchlist" && <Bookmark className="w-7 h-7 text-white/20" />}
                {tab === "recent" && <Clock className="w-7 h-7 text-white/20" />}
              </div>
              <p className="text-white/40 text-lg mb-2">
                {tab === "favorites" && "No favorites yet"}
                {tab === "watchlist" && "Your watchlist is empty"}
                {tab === "recent" && "No watch history"}
              </p>
              <p className="text-white/20 text-sm">
                {tab === "favorites" && "Heart an anime to add it here"}
                {tab === "watchlist" && "Bookmark anime to watch later"}
                {tab === "recent" && "Start watching to track your history"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {current.map((anime, i) => (
                <AnimeCard key={anime.mal_id} anime={anime} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
