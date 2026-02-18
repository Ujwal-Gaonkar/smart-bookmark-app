"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/app/components/toast";

export function SignedOutToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const shown = useRef(false);

  useEffect(() => {
    if (searchParams?.get("signed_out") === "true" && !shown.current) {
      shown.current = true;
      showToast("Signed out successfully. See you later! 👋", "success");
      router.replace("/login", { scroll: false });
    }
  }, [searchParams, showToast, router]);

  return null;
}
