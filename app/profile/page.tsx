import { Metadata } from "next";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Your favorites, watchlist and recently watched anime.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <ProfileClient />
    </div>
  );
}
