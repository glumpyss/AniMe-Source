import { Suspense } from "react";
import { getTopAnime, getTrending, getPopular, getSeasonal, getUpcoming } from "@/lib/jikan";
import HeroSection from "@/components/home/HeroSection";
import AnimeCarousel from "@/components/home/AnimeCarousel";
import AnimeGrid from "@/components/home/AnimeGrid";
import SearchBar from "@/components/home/SearchBar";
import UpcomingSection from "@/components/home/UpcomingSection";

export const revalidate = 3600;

export default async function HomePage() {
  const [topRes, trendingRes, popularRes, seasonalRes, upcomingRes] =
    await Promise.allSettled([
      getTopAnime(),
      getTrending(),
      getPopular(),
      getSeasonal(),
      getUpcoming(),
    ]);

  const top = topRes.status === "fulfilled" ? topRes.value.data : [];
  const trending = trendingRes.status === "fulfilled" ? trendingRes.value.data : [];
  const popular = popularRes.status === "fulfilled" ? popularRes.value.data : [];
  const seasonal = seasonalRes.status === "fulfilled" ? seasonalRes.value.data : [];
  const upcoming = upcomingRes.status === "fulfilled" ? upcomingRes.value.data : [];

  return (
    <div className="pb-20">
      <Suspense>
        <HeroSection animes={top} />
      </Suspense>

      <div className="mt-16 space-y-16">
        <SearchBar />

        <AnimeCarousel
          title="🔥 Trending Now"
          subtitle="What everyone is watching"
          animes={trending}
          showRank
        />

        <AnimeGrid
          title="⭐ Most Popular"
          subtitle="Top rated by the community"
          animes={popular.slice(0, 10)}
        />

        <AnimeCarousel
          title="🌸 This Season"
          subtitle="Currently airing anime"
          animes={seasonal}
        />

        <UpcomingSection animes={upcoming} />
      </div>
    </div>
  );
}
