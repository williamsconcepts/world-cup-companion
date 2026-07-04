"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

interface FantasyPlayerDto {
  player: { id: string; name: string; position: string };
  isCaptain: boolean;
}

interface FantasyTeamDto {
  id: string;
  name: string;
  budget: number;
  totalPoints: number;
  players: FantasyPlayerDto[];
}

export default function FantasyPage() {
  const { token } = useAuth();
  const [teams, setTeams] = useState<FantasyTeamDto[]>([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    api
      .get<{ teams: FantasyTeamDto[] }>("/fantasy", token)
      .then((res) => setTeams(res.teams))
      .catch(() => setTeams([]));
  }

  useEffect(refresh, [token]);

  async function createTeam() {
    setError(null);
    if (!newName.trim()) return;
    try {
      await api.post("/fantasy", { name: newName }, token);
      setNewName("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create that team.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">Fantasy Team</h1>
      <p className="mt-1 font-body text-chalk/60">Build a squad, name a captain, climb the points table.</p>

      <div className="mt-6 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Team name"
          className="rounded-md border border-pitch-700/50 bg-pitch-900 px-3 py-2 font-body text-chalk outline-none focus:border-gold-500"
        />
        <button
          onClick={createTeam}
          className="rounded-md bg-gold-500 px-4 py-2 font-display text-sm font-semibold uppercase text-ink hover:bg-gold-600"
        >
          Create team
        </button>
      </div>
      {error && <p className="mt-2 font-body text-sm text-live">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {teams.map((t) => (
          <div key={t.id} className="rounded-lg border border-pitch-700/40 bg-pitch-900/60 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-gold-500">{t.name}</h2>
              <span className="scoreboard-num text-sm text-chalk/60">{t.totalPoints} pts</span>
            </div>
            <p className="mt-1 font-body text-xs text-chalk/50">Budget remaining: {t.budget}</p>
            <ul className="mt-3 space-y-1">
              {t.players.length === 0 && (
                <li className="font-body text-sm text-chalk/40">No players added yet.</li>
              )}
              {t.players.map((p) => (
                <li key={p.player.id} className="flex items-center justify-between font-body text-sm text-chalk/80">
                  <span>
                    {p.player.name} <span className="text-chalk/40">· {p.player.position}</span>
                  </span>
                  {p.isCaptain && <span className="text-xs uppercase text-gold-500">Captain</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {teams.length === 0 && <p className="font-body text-chalk/50">You haven't created a fantasy team yet.</p>}
      </div>
    </div>
  );
}
