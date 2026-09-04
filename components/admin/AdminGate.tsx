"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="pt-32 pb-24 text-center text-ink-soft">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-6 pt-32 pb-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-3">Access denied</h1>
        <p className="text-ink-soft">
          Your account doesn&apos;t have admin access. Contact the shop owner
          if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
