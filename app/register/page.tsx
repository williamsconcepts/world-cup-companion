"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">Create your account</h1>
      <AuthForm
        fields={[
          { name: "email", label: "Email", type: "email" },
          { name: "username", label: "Username", type: "text" },
          { name: "password", label: "Password", type: "password" },
        ]}
        submitLabel="Create account"
        onSubmit={async (values) => {
          await register(values.email, values.username, values.password);
          router.push("/dashboard");
        }}
      />
      <p className="font-body text-sm text-chalk/60">
        Already have an account?{" "}
        <Link href="/login" className="text-gold-500 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
