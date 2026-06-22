import { create } from "zustand";
import { JikanAnime } from "./jikan";

interface WatchProgress {
  animeId: number;
  episodeId: number;
  progress: number; // 0-100
  timestamp: number;
}

interface UserStore {
  favorites: JikanAnime[];
  watchlist: JikanAnime[];
  recentlyWatched: JikanAnime[];
  watchProgress: Record<string, WatchProgress>;

  addFavorite: (anime: JikanAnime) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;

  addToWatchlist: (anime: JikanAnime) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;

  addRecentlyWatched: (anime: JikanAnime) => void;

  setWatchProgress: (animeId: number, episodeId: number, progress: number) => void;
  getWatchProgress: (animeId: number, episodeId: number) => number;
}

export const useUserStore = create<UserStore>((set, get) => ({
  favorites: [],
  watchlist: [],
  recentlyWatched: [],
  watchProgress: {},

  addFavorite: (anime) =>
    set((s) => ({
      favorites: s.favorites.some((a) => a.mal_id === anime.mal_id)
        ? s.favorites
        : [anime, ...s.favorites],
    })),
  removeFavorite: (id) =>
    set((s) => ({ favorites: s.favorites.filter((a) => a.mal_id !== id) })),
  isFavorite: (id) => get().favorites.some((a) => a.mal_id === id),

  addToWatchlist: (anime) =>
    set((s) => ({
      watchlist: s.watchlist.some((a) => a.mal_id === anime.mal_id)
        ? s.watchlist
        : [anime, ...s.watchlist],
    })),
  removeFromWatchlist: (id) =>
    set((s) => ({ watchlist: s.watchlist.filter((a) => a.mal_id !== id) })),
  isInWatchlist: (id) => get().watchlist.some((a) => a.mal_id === id),

  addRecentlyWatched: (anime) =>
    set((s) => ({
      recentlyWatched: [
        anime,
        ...s.recentlyWatched.filter((a) => a.mal_id !== anime.mal_id),
      ].slice(0, 20),
    })),

  setWatchProgress: (animeId, episodeId, progress) =>
    set((s) => ({
      watchProgress: {
        ...s.watchProgress,
        [`${animeId}-${episodeId}`]: { animeId, episodeId, progress, timestamp: Date.now() },
      },
    })),
  getWatchProgress: (animeId, episodeId) =>
    get().watchProgress[`${animeId}-${episodeId}`]?.progress ?? 0,
}));
