const BASE = "https://api.jikan.moe/v4";

async function fetchJikan<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: 3600 },
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) throw new Error(`Jikan API error: ${res.status} ${path}`);
  return res.json();
}

export interface JikanImage {
  jpg: { image_url: string; small_image_url: string; large_image_url: string };
  webp?: { image_url: string; small_image_url: string; large_image_url: string };
}

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  episodes?: number;
  status?: string;
  aired?: { string: string; from?: string; to?: string };
  season?: string;
  year?: number;
  duration?: string;
  rating?: string;
  source?: string;
  type?: string;
  images: JikanImage;
  trailer?: { youtube_id?: string; url?: string; images?: { large_image_url?: string } };
  genres?: { mal_id: number; name: string }[];
  themes?: { mal_id: number; name: string }[];
  studios?: { mal_id: number; name: string }[];
  producers?: { mal_id: number; name: string }[];
  background?: string;
  favorites?: number;
}

export interface JikanCharacter {
  character: {
    mal_id: number;
    name: string;
    images: JikanImage;
  };
  role: string;
  voice_actors?: { person: { name: string; images: JikanImage }; language: string }[];
}

export interface JikanEpisode {
  mal_id: number;
  title: string;
  title_japanese?: string;
  aired?: string;
  score?: number;
  filler: boolean;
  recap: boolean;
}

export interface JikanReview {
  mal_id: number;
  reviewer: { username: string; url: string; image_url?: string };
  score: number;
  review: string;
  date: string;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: { count: number; total: number; per_page: number };
}

export interface JikanListResponse<T> {
  data: T[];
  pagination?: JikanPagination;
}

export interface JikanSingleResponse<T> {
  data: T;
}

// Trending (Top airing)
export const getTrending = () =>
  fetchJikan<JikanListResponse<JikanAnime>>("/top/anime?filter=airing&limit=10");

// Popular (Top by score)
export const getPopular = () =>
  fetchJikan<JikanListResponse<JikanAnime>>("/top/anime?filter=bypopularity&limit=20");

// Seasonal
export const getSeasonal = (year?: number, season?: string) => {
  if (year && season) {
    return fetchJikan<JikanListResponse<JikanAnime>>(`/seasons/${year}/${season}?limit=20`);
  }
  return fetchJikan<JikanListResponse<JikanAnime>>("/seasons/now?limit=20");
};

// Upcoming
export const getUpcoming = () =>
  fetchJikan<JikanListResponse<JikanAnime>>("/seasons/upcoming?limit=20");

// Anime details
export const getAnimeById = (id: number) =>
  fetchJikan<JikanSingleResponse<JikanAnime>>(`/anime/${id}/full`);

// Characters
export const getAnimeCharacters = (id: number) =>
  fetchJikan<JikanListResponse<JikanCharacter>>(`/anime/${id}/characters`);

// Episodes
export const getAnimeEpisodes = (id: number, page = 1) =>
  fetchJikan<JikanListResponse<JikanEpisode>>(`/anime/${id}/episodes?page=${page}`);

// Recommendations
export const getAnimeRecommendations = (id: number) =>
  fetchJikan<JikanListResponse<{ entry: JikanAnime; votes: number }>>(`/anime/${id}/recommendations`);

// Search
export interface SearchParams {
  q?: string;
  genres?: string;
  season?: string;
  year?: number;
  status?: string;
  min_score?: number;
  max_score?: number;
  order_by?: string;
  page?: number;
  limit?: number;
  type?: string;
}

export const searchAnime = (params: SearchParams) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) qs.set(k, String(v));
  });
  return fetchJikan<JikanListResponse<JikanAnime>>(`/anime?${qs.toString()}`);
};

// Top anime for hero
export const getTopAnime = () =>
  fetchJikan<JikanListResponse<JikanAnime>>("/top/anime?limit=5");

// Genres list
export const getGenres = () =>
  fetchJikan<JikanListResponse<{ mal_id: number; name: string; count: number }>>("/genres/anime");
