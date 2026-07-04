"use client";

import { motion } from "framer-motion";

interface TickerMatch {
  id: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "LIVE" | "HALFTIME" | "FINISHED" | "POSTPONED";
  minute?: string;
}

export function ScoreTicker({ matches }: { matches: TickerMatch[] }) {
  if (matches.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly
  const loopMatches = [...matches, ...matches];

  return (
    <div className="relative overflow-hidden border-b border-pitch-700/40 bg-ink py-2">
      <motion.div
        className="flex w-max gap-8 px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: matches.length * 6, repeat: Infinity, ease: "linear" }}
      >
        {loopMatches.map((m, i) => (
          <div key={`${m.id}-${i}`} className="flex items-center gap-2 whitespace-nowrap font-body text-sm text-chalk/80">
            {m.status === "LIVE" && (
              <span className="flex items-center gap-1 font-display text-xs font-bold uppercase text-live">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
                Live{m.minute ? ` ${m.minute}'` : ""}
              </span>
            )}
            <span>{m.home}</span>
            <span className="scoreboard-num rounded bg-pitch-900 px-2 py-0.5 text-gold-500">
              {m.homeScore ?? "-"} : {m.awayScore ?? "-"}
            </span>
            <span>{m.away}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
