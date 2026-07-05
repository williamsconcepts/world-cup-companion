"use client";

import { motion } from "framer-motion";

interface MatchCardProps {
  stage: string;
  home: string;
  away: string;
  kickoffAt: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: "SCHEDULED" | "LIVE" | "HALFTIME" | "FINISHED" | "POSTPONED";
  children?: React.ReactNode;
}

export function MatchCard({ stage, home, away, kickoffAt, homeScore, awayScore, status, children }: MatchCardProps) {
  const kickoff = new Date(kickoffAt);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-lg border border-pitch-700/40 bg-pitch-900/60 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="font-body text-xs uppercase tracking-wide text-chalk/50">{stage}</span>
        {status === "LIVE" ? (
          <span className="flex items-center gap-1 font-display text-xs font-bold uppercase text-live">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
            Live
          </span>
        ) : (
          <span className="font-body text-xs text-chalk/50">
            {kickoff.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ·{" "}
            {kickoff.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between font-display text-lg font-semibold text-chalk">
        <span>{home}</span>
        <span className="scoreboard-num text-gold-500">
          {status === "SCHEDULED" ? "vs" : `${homeScore ?? 0} - ${awayScore ?? 0}`}
        </span>
        <span>{away}</span>
      </div>

      {children && <div className="mt-3 border-t border-pitch-700/40 pt-3">{children}</div>}
    </motion.div>
  );
}
