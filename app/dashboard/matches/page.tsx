"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { MatchCard } from "@/components/MatchCard";

interface MatchDto {
  id: string;
  stage: string;
  kickoffAt: string;
  status: "SCHEDULED" | "LIVE" | "HALFTIME" | "FINISHED" | "POSTPONED";
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: { name: string };
  awayTeam: { name: string };
}

export default function MatchesPage() {
  const { token } = useAuth();
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ matches: MatchDto[] }>("/matches", token)
      .then((res) => setMatches(res.matches))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">Matches</h1>
      <p className="mt-1 font-body text-chalk/60">Every fixture, group stage through final.</p>

      {loading ? (
        <p className="mt-6 font-body text-chalk/50">Loading fixtures…</p>
      ) : matches.length === 0 ? (
        <p className="mt-6 font-body text-chalk/50">
          No fixtures yet — run the Prisma seed script to add sample matches.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {matches.map((m) => (
            <MatchCard
              key={m.id}
              stage={m.stage}
              home={m.homeTeam.name}
              away={m.awayTeam.name}
              kickoffAt={m.kickoffAt}
              homeScore={m.homeScore}
              awayScore={m.awayScore}
              status={m.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
