"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function AuthRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  // Revalidate proxy-protected auth state whenever an auth page mounts.
  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
}
