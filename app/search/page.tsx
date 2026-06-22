import { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Discover Anime",
  description: "Search and filter thousands of anime titles.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <Suspense>
        <SearchClient />
      </Suspense>
    </div>
  );
}
