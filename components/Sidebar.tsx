"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/dashboard/matches", label: "Matches" },
  { href: "/dashboard/predictions", label: "Predictions" },
  { href: "/dashboard/fantasy", label: "Fantasy Team" },
  { href: "/dashboard/ratings", label: "Player Ratings" },
  { href: "/dashboard/discussions", label: "Fan Discussions" },
  { href: "/dashboard/leaderboard", label: "Leaderboard" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-60 flex-col justify-between border-r border-pitch-700/40 bg-pitch-900 px-4 py-6">
      <div>
        <Link href="/dashboard" className="mb-8 block font-display text-xl font-bold uppercase tracking-wide text-gold-500">
          World Cup Companion
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 font-body text-sm transition-colors ${
                  active
                    ? "bg-pitch-700/60 text-chalk"
                    : "text-chalk/60 hover:bg-pitch-700/30 hover:text-chalk"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-pitch-700/40 pt-4">
        <p className="truncate font-body text-sm text-chalk/70">{user?.username}</p>
        <button
          onClick={logout}
          className="mt-2 font-body text-xs uppercase tracking-wide text-chalk/50 hover:text-live"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
