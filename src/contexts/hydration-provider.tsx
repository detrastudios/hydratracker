"use client";

import type { ReactNode } from "react";
import { createContext, useState, useEffect, useCallback } from "react";
import type { IntakeRecord, UserSettings, Reminder } from "@/lib/types";
import { format } from "date-fns";

const isServer = typeof window === "undefined";

const getInitialState = <T>(key: string, defaultValue: T): T => {
  if (isServer) {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

type HydrationContextType = {
  settings: UserSettings;
  intakeHistory: IntakeRecord[];
  todaysIntake: IntakeRecord[];
  totalToday: number;
  progress: number;
  addIntake: (amount: number) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateReminders: (reminders: Reminder[]) => void;
  isLoading: boolean;
};

export const HydrationContext = createContext<HydrationContextType | undefined>(
  undefined
);

export function HydrationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>(() =>
    getInitialState<UserSettings>("hydration-settings", {
      dailyGoal: 2000,
      wakeUpTime: "07:00",
      bedTime: "23:00",
      activityLevel: "moderatelyActive",
      climate: "temperate",
      reminders: [],
    })
  );
  const [intakeHistory, setIntakeHistory] = useState<IntakeRecord[]>(() =>
    getInitialState<IntakeRecord[]>("hydration-history", [])
  );

  useEffect(() => {
    // Load initial state from localStorage on mount
    const storedSettings = getInitialState<UserSettings>("hydration-settings", settings);
    const storedHistory = getInitialState<IntakeRecord[]>("hydration-history", []);
    setSettings(storedSettings);
    setIntakeHistory(storedHistory);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      window.localStorage.setItem("hydration-settings", JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      window.localStorage.setItem("hydration-history", JSON.stringify(intakeHistory));
    }
  }, [intakeHistory, isLoading]);

  const addIntake = useCallback((amount: number) => {
    if (amount <= 0) return;
    const newRecord: IntakeRecord = {
      id: crypto.randomUUID(),
      amount,
      timestamp: new Date().toISOString(),
    };
    setIntakeHistory((prev) => [...prev, newRecord]);
  }, []);
  
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateReminders = useCallback((reminders: Reminder[]) => {
    setSettings(prev => ({...prev, reminders}));
  }, []);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaysIntake = intakeHistory.filter((record) =>
    record.timestamp.startsWith(todayStr)
  );

  const totalToday = todaysIntake.reduce(
    (sum, record) => sum + record.amount,
    0
  );
  
  const progress = settings.dailyGoal > 0 ? Math.min((totalToday / settings.dailyGoal) * 100, 100) : 0;

  const value = {
    settings,
    intakeHistory,
    todaysIntake,
    totalToday,
    progress,
    addIntake,
    updateSettings,
    updateReminders,
    isLoading,
  };

  return (
    <HydrationContext.Provider value={value}>
      {children}
    </HydrationContext.Provider>
  );
}
