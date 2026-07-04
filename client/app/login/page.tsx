"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">Sign in</h1>
      <AuthForm
        fields={[
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ]}
        submitLabel="Sign in"
        onSubmit={async (values) => {
          await login(values.email, values.password);
          router.push("/dashboard");
        }}
      />
      <p className="font-body text-sm text-chalk/60">
        New here?{" "}
        <Link href="/register" className="text-gold-500 hover:underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
