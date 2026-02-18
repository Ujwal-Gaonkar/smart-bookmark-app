"use client";

import { type ReactNode } from "react";
import { ToastProvider } from "@/app/components/toast";
import { ConfirmProvider } from "@/app/components/confirm-dialog";

export function DashboardProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ToastProvider>
  );
}
