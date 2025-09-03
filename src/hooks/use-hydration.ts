"use client";

import { HydrationContext } from "@/contexts/hydration-provider";
import { useContext } from "react";

export const useHydration = () => {
  const context = useContext(HydrationContext);
  if (!context) {
    throw new Error("useHydration must be used within a HydrationProvider");
  }
  return context;
};
