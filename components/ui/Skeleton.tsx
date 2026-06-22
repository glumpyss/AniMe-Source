import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function Skeleton({ className }: Props) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-white/5", className)}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
    </div>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div className="w-44 flex-shrink-0">
      <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
      <Skeleton className="mt-2 h-4 w-3/4 rounded" />
      <Skeleton className="mt-1 h-3 w-1/2 rounded" />
    </div>
  );
}
