"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import toast from "react-hot-toast";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Invalid email or password"
          : signInError.message
      );
      toast.error(
        signInError.message === "Invalid login credentials"
          ? "Invalid email or password"
          : signInError.message
      );
      return;
    }
    toast.success(`Welcome back! Signed in as ${email.trim()}.`);
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f4] px-4">
      <div className="w-full max-w-md rounded-xl border border-[#e7e5e4] bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-[#27272a]">Sign in</h1>
        <p className="mt-1 text-sm text-[#71717a]">
          Enter your email and password
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-[#52525b]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Mohamedmahmoud.h13@gmail.com"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-[#e7e5e4] px-3 py-2.5 text-[#27272a] placeholder:text-[#a1a1aa] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-[#52525b]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#e7e5e4] px-3 py-2.5 text-[#27272a] placeholder:text-[#a1a1aa] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-[#3B82F6] py-2.5 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* <p className="mt-6 text-center text-sm text-[#71717a]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-[#3B82F6] hover:underline">
            Create account
          </Link>
        </p> */}
      </div>
    </div>
  );
}

export default LoginPage;