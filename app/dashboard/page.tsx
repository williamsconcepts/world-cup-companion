"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const MODULES = [
  { href: "/dashboard/matches", label: "Matches", blurb: "Fixtures, live scores, and results." },
  { href: "/dashboard/predictions", label: "Predictions", blurb: "Call the scoreline before kickoff." },
  { href: "/dashboard/fantasy", label: "Fantasy Team", blurb: "Build your squad, captain a star." },
  { href: "/dashboard/ratings", label: "Player Ratings", blurb: "Rate performances after the whistle." },
  { href: "/dashboard/discussions", label: "Fan Discussions", blurb: "Talk tactics with other fans." },
  { href: "/dashboard/leaderboard", label: "Leaderboard", blurb: "See who's calling it best." },
];

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">
        Welcome back, {user?.username}
      </h1>
      <p className="mt-1 font-body text-chalk/60">Here's everything happening around the tournament.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-lg border border-pitch-700/40 bg-pitch-900/60 p-5 transition-colors hover:border-gold-500/50"
          >
            <h2 className="font-display text-lg font-semibold text-gold-500">{m.label}</h2>
            <p className="mt-1 font-body text-sm text-chalk/60">{m.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
