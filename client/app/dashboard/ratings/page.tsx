"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

export default function RatingsPage() {
  const { token } = useAuth();
  const [matchId, setMatchId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [rating, setRating] = useState(7);
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    setStatus(null);
    try {
      await api.post("/ratings", { matchId, playerId, rating }, token);
      setStatus("Rating saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Couldn't save that rating.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">Player Ratings</h1>
      <p className="mt-1 font-body text-chalk/60">Rate performances 1–10 once the final whistle blows.</p>

      <div className="mt-6 max-w-sm space-y-4 rounded-lg border border-pitch-700/40 bg-pitch-900/60 p-5">
        <label className="flex flex-col gap-1">
          <span className="font-body text-xs uppercase tracking-wide text-chalk/60">Match ID</span>
          <input
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            className="rounded-md border border-pitch-700/50 bg-pitch-900 px-3 py-2 font-body text-chalk outline-none focus:border-gold-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-body text-xs uppercase tracking-wide text-chalk/60">Player ID</span>
          <input
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="rounded-md border border-pitch-700/50 bg-pitch-900 px-3 py-2 font-body text-chalk outline-none focus:border-gold-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-body text-xs uppercase tracking-wide text-chalk/60">Rating: {rating}</span>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </label>
        <button
          onClick={submit}
          className="w-full rounded-md bg-gold-500 px-4 py-2 font-display text-sm font-semibold uppercase text-ink hover:bg-gold-600"
        >
          Submit rating
        </button>
        {status && <p className="font-body text-sm text-chalk/70">{status}</p>}
      </div>

      <p className="mt-4 max-w-sm font-body text-xs text-chalk/40">
        In the finished app, match and player IDs would come from dropdowns wired to the Matches module —
        this page is wired directly to the API so you can test the ratings endpoint end to end.
      </p>
    </div>
  );
}
