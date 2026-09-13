"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function checkAuth() {
      try {
        const isAuthenticated = await checkSession();
        if (isAuthenticated) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        router.refresh();
      }
    }

    checkAuth();
  }, [setUser, clearIsAuthenticated, router]);

  return children;
}
