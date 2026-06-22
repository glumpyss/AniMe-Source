"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { JikanCharacter } from "@/lib/jikan";

export default function CharacterList({ characters }: { characters: JikanCharacter[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {characters.map((c, i) => (
        <motion.div
          key={c.character.mal_id}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="group glass rounded-2xl overflow-hidden hover:ring-1 hover:ring-purple-500/40 transition-all"
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={c.character.images.jpg.image_url || "/placeholder.jpg"}
              alt={c.character.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-xs font-medium text-white truncate">{c.character.name}</p>
              <p className="text-[10px] text-purple-300/70">{c.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
