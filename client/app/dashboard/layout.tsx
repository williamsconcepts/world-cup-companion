"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ScoreTicker } from "@/components/ScoreTicker";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

interface MatchSummary {
  id: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "LIVE" | "HALFTIME" | "FINISHED" | "POSTPONED";
  homeTeam: { name: string };
  awayTeam: { name: string };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchSummary[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    api
      .get<{ matches: MatchSummary[] }>("/matches", token)
      .then((res) => setMatches(res.matches))
      .catch(() => setMatches([]));
  }, [token]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center font-body text-chalk/60">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <ScoreTicker
          matches={matches.map((m) => ({
            id: m.id,
            home: m.homeTeam.name,
            away: m.awayTeam.name,
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            status: m.status,
          }))}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
