"use client";

import { type ReactNode } from "react";
import { ToastProvider } from "@/app/components/toast";
import { SignedOutToast } from "./signed-out-toast";

export function LoginProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SignedOutToast />
      {children}
    </ToastProvider>
  );
}
