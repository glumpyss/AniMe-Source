import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  variant?: "purple" | "glass" | "outline" | "green" | "yellow" | "red";
  className?: string;
}

export default function Badge({ children, variant = "glass", className }: Props) {
  const variants = {
    purple: "bg-purple-600 text-white",
    glass: "bg-white/10 backdrop-blur-sm text-white/80 border border-white/10",
    outline: "border border-purple-500/50 text-purple-300",
    green: "bg-green-500/20 text-green-400 border border-green-500/30",
    yellow: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    red: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
