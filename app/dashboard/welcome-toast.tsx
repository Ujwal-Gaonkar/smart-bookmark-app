"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/app/components/toast";

export function WelcomeToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const shown = useRef(false);

  useEffect(() => {
    if (searchParams?.get("signed_in") === "true" && !shown.current) {
      shown.current = true;
      showToast("Signed in successfully! Welcome back 👋", "success");
      router.replace("/dashboard", { scroll: false });
    }
  }, [searchParams, showToast, router]);

  return null;
}
