import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Clock, Tv, Calendar, Play, BookOpen, TrendingUp } from "lucide-react";
import {
  getAnimeById,
  getAnimeCharacters,
  getAnimeRecommendations,
} from "@/lib/jikan";
import { formatScore, formatNumber, getScoreColor } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import AnimeActionButtons from "@/components/anime/AnimeActionButtons";
import CharacterList from "@/components/anime/CharacterList";
import RecommendationGrid from "@/components/anime/RecommendationGrid";

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await getAnimeById(Number(id));
    const anime = res.data;
    return {
      title: anime.title_english || anime.title,
      description: anime.synopsis?.slice(0, 160),
      openGraph: {
        images: [anime.images.jpg.large_image_url],
      },
    };
  } catch {
    return { title: "Anime Details" };
  }
}

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;
  const animeId = Number(id);

  const [animeRes, charRes, recRes] = await Promise.allSettled([
    getAnimeById(animeId),
    getAnimeCharacters(animeId),
    getAnimeRecommendations(animeId),
  ]);

  if (animeRes.status === "rejected") notFound();

  const anime = animeRes.value.data;
  const characters = charRes.status === "fulfilled" ? charRes.value.data.slice(0, 12) : [];
  const recommendations = recRes.status === "fulfilled" ? recRes.value.data.slice(0, 12) : [];

  const bannerImg =
    anime.trailer?.images?.large_image_url ||
    anime.images.jpg.large_image_url;

  const statusColor = {
    "Currently Airing": "green",
    "Finished Airing": "glass",
    "Not yet aired": "yellow",
  }[anime.status || ""] as "green" | "glass" | "yellow" || "glass";

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={bannerImg}
          alt={anime.title}
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-48 md:w-56 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 ring-2 ring-white/10">
              <Image
                src={anime.images.webp?.large_image_url || anime.images.jpg.large_image_url}
                alt={anime.title}
                width={224}
                height={320}
                className="object-cover w-full aspect-[2/3]"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 mt-8 md:mt-16">
            <div className="flex flex-wrap gap-2 mb-3">
              {anime.genres?.map((g) => (
                <Badge key={g.mal_id} variant="outline">{g.name}</Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-1 leading-tight">
              {anime.title_english || anime.title}
            </h1>
            {anime.title_english && anime.title !== anime.title_english && (
              <p className="text-white/40 text-lg mb-4">{anime.title}</p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {anime.score && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className={`text-lg font-bold ${getScoreColor(anime.score)}`}>{formatScore(anime.score)}</span>
                  <span className="text-white/40">({formatNumber(anime.scored_by)} votes)</span>
                </div>
              )}
              <Badge variant={statusColor}>{anime.status}</Badge>
              {anime.rank && <span className="text-white/50">#{anime.rank} Ranked</span>}
              {anime.popularity && <span className="text-white/50">#{anime.popularity} Popularity</span>}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm text-white/60">
              {anime.episodes && (
                <span className="flex items-center gap-1.5"><Tv className="w-4 h-4 text-purple-400" />{anime.episodes} Episodes</span>
              )}
              {anime.duration && (
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-purple-400" />{anime.duration}</span>
              )}
              {anime.year && (
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-400" />{anime.year}</span>
              )}
              {anime.studios?.[0] && (
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-purple-400" />{anime.studios[0].name}</span>
              )}
              {anime.members && (
                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-purple-400" />{formatNumber(anime.members)} members</span>
              )}
            </div>

            {/* Action buttons */}
            <AnimeActionButtons anime={anime} />
          </div>
        </div>

        {/* Synopsis */}
        <section className="mt-12 glass rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4">Synopsis</h2>
          <p className="text-white/70 leading-relaxed">
            {anime.synopsis?.replace(/\[Written by.*?\]/g, "").trim() || "No synopsis available."}
          </p>
        </section>

        {/* Characters */}
        {characters.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-white mb-5">Characters</h2>
            <CharacterList characters={characters} />
          </section>
        )}

        {/* More details */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-3xl p-6">
            <h3 className="font-semibold text-white mb-4">Information</h3>
            <dl className="space-y-2 text-sm">
              {[
                ["Type", anime.type],
                ["Source", anime.source],
                ["Episodes", anime.episodes],
                ["Status", anime.status],
                ["Aired", anime.aired?.string],
                ["Season", anime.season ? `${anime.season} ${anime.year}` : anime.year],
                ["Rating", anime.rating],
                ["Duration", anime.duration],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <dt className="text-white/40">{k}</dt>
                  <dd className="text-white/80 text-right">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="font-semibold text-white mb-4">Studios & Producers</h3>
            <div className="space-y-3">
              {anime.studios?.length ? (
                <div>
                  <p className="text-xs text-white/40 mb-2">Studios</p>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.map((s) => <Badge key={s.mal_id} variant="purple">{s.name}</Badge>)}
                  </div>
                </div>
              ) : null}
              {anime.producers?.length ? (
                <div>
                  <p className="text-xs text-white/40 mb-2">Producers</p>
                  <div className="flex flex-wrap gap-2">
                    {anime.producers.slice(0, 5).map((p) => <Badge key={p.mal_id} variant="glass">{p.name}</Badge>)}
                  </div>
                </div>
              ) : null}
              {anime.themes?.length ? (
                <div>
                  <p className="text-xs text-white/40 mb-2">Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {anime.themes.map((t) => <Badge key={t.mal_id} variant="outline">{t.name}</Badge>)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white mb-5">Recommendations</h2>
            <RecommendationGrid recommendations={recommendations} />
          </section>
        )}

        {/* Watch CTA */}
        <div className="mt-12 text-center py-12 glass rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to watch?</h2>
          <p className="text-white/50 mb-6">Start from Episode 1 right now</p>
          <Link
            href={`/watch/${anime.mal_id}/1`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25 active:scale-95"
          >
            <Play className="w-5 h-5 fill-white" />
            Watch Episode 1
          </Link>
        </div>
      </div>
    </div>
  );
}
