"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { JikanAnime } from "@/lib/jikan";
import { ThumbsUp } from "lucide-react";

interface Rec { entry: JikanAnime; votes: number }

export default function RecommendationGrid({ recommendations }: { recommendations: Rec[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {recommendations.map((rec, i) => (
        <motion.div
          key={rec.entry.mal_id}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
        >
          <Link href={`/anime/${rec.entry.mal_id}`} className="group block">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5">
              <Image
                src={rec.entry.images.webp?.large_image_url || rec.entry.images.jpg.large_image_url}
                alt={rec.entry.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5 text-xs text-white/60">
                <ThumbsUp className="w-3 h-3" />
                {rec.votes}
              </div>
            </div>
            <p className="mt-2 text-xs font-medium text-white/70 line-clamp-2 group-hover:text-purple-300 transition-colors">
              {rec.entry.title_english || rec.entry.title}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
