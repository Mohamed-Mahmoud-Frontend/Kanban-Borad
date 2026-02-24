"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

const PUBLIC_PATHS = ["/login", "/register"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p));
      if (!session && !isPublic) {
        router.replace("/login");
        return;
      }
      if (session && isPublic) {
        router.replace("/");
        return;
      }
      setChecking(false);
    };
    check();
  }, [pathname, router]);

  if (checking && !PUBLIC_PATHS.some((p) => pathname?.startsWith(p))) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f5f4]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-[#e7e5e4] border-t-[#3B82F6]"
          aria-hidden
        />
        <p className="text-sm font-medium text-[#71717a]">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
