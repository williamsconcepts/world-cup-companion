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

export default function PredictionsPage() {
  const { token } = useAuth();
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [guesses, setGuesses] = useState<Record<string, { home: string; away: string }>>({});
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ matches: MatchDto[] }>("/matches?status=SCHEDULED", token)
      .then((res) => setMatches(res.matches))
      .catch(() => setMatches([]));
  }, [token]);

  async function submitPrediction(matchId: string) {
    setError(null);
    const guess = guesses[matchId];
    if (!guess?.home || !guess?.away) {
      setError("Enter a score for both teams first.");
      return;
    }
    try {
      await api.post(
        "/predictions",
        { matchId, predHomeScore: Number(guess.home), predAwayScore: Number(guess.away) },
        token
      );
      setSavedId(matchId);
      setTimeout(() => setSavedId(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that prediction.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">Predictions</h1>
      <p className="mt-1 font-body text-chalk/60">Call the scoreline before kickoff — locked once the match starts.</p>

      {error && <p className="mt-4 font-body text-sm text-live">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            stage={m.stage}
            home={m.homeTeam.name}
            away={m.awayTeam.name}
            kickoffAt={m.kickoffAt}
            status={m.status}
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="0"
                className="w-16 rounded-md border border-pitch-700/50 bg-pitch-900 px-2 py-1 text-center font-mono scoreboard-num text-chalk outline-none focus:border-gold-500"
                value={guesses[m.id]?.home ?? ""}
                onChange={(e) =>
                  setGuesses((g) => ({ ...g, [m.id]: { ...g[m.id], home: e.target.value } }))
                }
              />
              <span className="font-body text-chalk/50">:</span>
              <input
                type="number"
                min={0}
                placeholder="0"
                className="w-16 rounded-md border border-pitch-700/50 bg-pitch-900 px-2 py-1 text-center font-mono scoreboard-num text-chalk outline-none focus:border-gold-500"
                value={guesses[m.id]?.away ?? ""}
                onChange={(e) =>
                  setGuesses((g) => ({ ...g, [m.id]: { ...g[m.id], away: e.target.value } }))
                }
              />
              <button
                onClick={() => submitPrediction(m.id)}
                className="ml-auto rounded-md bg-gold-500 px-3 py-1 font-display text-sm font-semibold uppercase text-ink hover:bg-gold-600"
              >
                {savedId === m.id ? "Saved" : "Save"}
              </button>
            </div>
          </MatchCard>
        ))}
        {matches.length === 0 && (
          <p className="font-body text-chalk/50">No upcoming matches open for predictions right now.</p>
        )}
      </div>
    </div>
  );
}
