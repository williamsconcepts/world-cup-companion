import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
        Every match. Every prediction. One tab.
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-bold uppercase leading-tight text-chalk">
        World Cup <span className="text-gold-500">Companion</span>
      </h1>
      <p className="mt-4 max-w-md font-body text-chalk/70">
        Track live scores, call your scorelines, build a fantasy squad, rate the players,
        and argue it out with fans who saw the same match differently.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/register"
          className="rounded-md bg-gold-500 px-6 py-3 font-display font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-gold-600"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-chalk/30 px-6 py-3 font-display font-semibold uppercase tracking-wide text-chalk transition-colors hover:bg-chalk/10"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
