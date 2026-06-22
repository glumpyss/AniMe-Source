import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
};

export const metadata: Metadata = {
  title: { default: "AniMe — Your Premium Anime Destination", template: "%s | AniMe" },
  description: "Discover, track, and watch your favorite anime. Trending, seasonal, and popular anime all in one place.",
  keywords: ["anime", "watch anime", "anime streaming", "trending anime", "anime list"],
  openGraph: {
    type: "website",
    siteName: "AniMe",
    title: "AniMe — Your Premium Anime Destination",
    description: "Discover, track, and watch your favorite anime.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-[#0A0A0A] text-white antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
