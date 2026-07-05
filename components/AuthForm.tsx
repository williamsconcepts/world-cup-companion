"use client";

import { useState } from "react";

interface Field {
  name: string;
  label: string;
  type: string;
}

export function AuthForm({
  fields,
  submitLabel,
  onSubmit,
}: {
  fields: Field[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1">
          <span className="font-body text-xs uppercase tracking-wide text-chalk/60">{field.label}</span>
          <input
            type={field.type}
            required
            value={values[field.name] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
            className="rounded-md border border-pitch-700/50 bg-pitch-900 px-3 py-2 font-body text-chalk outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
          />
        </label>
      ))}

      {error && <p className="font-body text-sm text-live">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-md bg-gold-500 px-4 py-2 font-display font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-gold-600 disabled:opacity-60"
      >
        {submitting ? "Please wait…" : submitLabel}
      </button>
    </form>
  );
}
