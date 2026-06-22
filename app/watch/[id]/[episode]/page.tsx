import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnimeById, getAnimeEpisodes } from "@/lib/jikan";
import WatchClient from "@/components/watch/WatchClient";

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string; episode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id, episode } = await params;
    const res = await getAnimeById(Number(id));
    const anime = res.data;
    return {
      title: `${anime.title_english || anime.title} — Episode ${episode}`,
      description: `Watch ${anime.title_english || anime.title} Episode ${episode}`,
    };
  } catch {
    return { title: "Watch" };
  }
}

export default async function WatchPage({ params }: Props) {
  const { id, episode } = await params;
  const animeId = Number(id);
  const episodeNum = Number(episode);

  if (isNaN(animeId) || isNaN(episodeNum)) notFound();

  const [animeRes, episodesRes] = await Promise.allSettled([
    getAnimeById(animeId),
    getAnimeEpisodes(animeId, Math.ceil(episodeNum / 100)),
  ]);

  if (animeRes.status === "rejected") notFound();

  const anime = animeRes.value.data;
  const episodes = episodesRes.status === "fulfilled" ? episodesRes.value.data : [];

  return <WatchClient anime={anime} episodes={episodes} currentEpisode={episodeNum} />;
}
