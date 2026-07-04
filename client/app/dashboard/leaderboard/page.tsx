"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

interface EntryDto {
  id: string;
  totalPoints: number;
  predictionPts: number;
  fantasyPts: number;
  user: { username: string };
}

export default function LeaderboardPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<EntryDto[]>([]);

  useEffect(() => {
    api
      .get<{ entries: EntryDto[] }>("/leaderboard", token)
      .then((res) => setEntries(res.entries))
      .catch(() => setEntries([]));
  }, [token]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">Leaderboard</h1>
      <p className="mt-1 font-body text-chalk/60">Ranked by combined prediction and fantasy points.</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-pitch-700/40">
        <table className="w-full text-left font-body text-sm text-chalk/80">
          <thead className="bg-pitch-900 font-display text-xs uppercase tracking-wide text-chalk/50">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Fan</th>
              <th className="px-4 py-3">Predictions</th>
              <th className="px-4 py-3">Fantasy</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={e.id} className="border-t border-pitch-700/30 bg-pitch-900/40">
                <td className="scoreboard-num px-4 py-3 text-gold-500">{i + 1}</td>
                <td className="px-4 py-3">{e.user.username}</td>
                <td className="scoreboard-num px-4 py-3">{e.predictionPts}</td>
                <td className="scoreboard-num px-4 py-3">{e.fantasyPts}</td>
                <td className="scoreboard-num px-4 py-3 font-semibold">{e.totalPoints}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-chalk/50">
                  No leaderboard data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
