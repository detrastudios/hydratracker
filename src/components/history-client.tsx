"use client";

import { useState } from "react";
import { useHydration } from "@/hooks/use-hydration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsumptionChart } from "@/components/consumption-chart";
import {
  startOfToday,
  startOfWeek,
  startOfMonth,
  endOfToday,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  isWithinInterval,
  isSameDay,
  add,
} from "date-fns";
import type { IntakeRecord } from "@/lib/types";

type View = "day" | "week" | "month";

const processData = (records: IntakeRecord[], view: View) => {
  const now = new Date();
  if (view === "day") {
    const today = startOfToday();
    const interval = { start: today, end: endOfToday() };
    const todaysRecords = records.filter(r => isWithinInterval(new Date(r.timestamp), interval));
    
    const hourlyData: { [key: string]: number } = {};
    for (let i=0; i < 24; i++) {
        hourlyData[format(add(today, { hours: i }), "ha")] = 0;
    }

    todaysRecords.forEach(r => {
        const hour = format(new Date(r.timestamp), "ha");
        hourlyData[hour] = (hourlyData[hour] || 0) + r.amount;
    });

    return Object.entries(hourlyData).map(([label, intake]) => ({ label, intake }));
  }

  if (view === "week") {
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return days.map(day => {
        const dailyTotal = records
            .filter(r => isSameDay(new Date(r.timestamp), day))
            .reduce((sum, r) => sum + r.amount, 0);
        return { label: format(day, 'EEE'), intake: dailyTotal };
    });
  }

  if (view === "month") {
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });

    return weeks.map((week, index) => {
        const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
        const weeklyTotal = records
            .filter(r => isWithinInterval(new Date(r.timestamp), { start: week, end: weekEnd }))
            .reduce((sum, r) => sum + r.amount, 0);
        return { label: `Week ${index + 1}`, intake: weeklyTotal };
    });
  }

  return [];
};


export function HistoryClient() {
  const { intakeHistory } = useHydration();
  const [view, setView] = useState<View>("week");

  const chartData = processData(intakeHistory, view);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Consumption History</h1>
        <p className="text-muted-foreground">Review your hydration habits over time.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Viewing consumption for this {view}.
              </CardDescription>
            </div>
            <Tabs value={view} onValueChange={(v) => setView(v as View)}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
            {intakeHistory.length > 0 ? (
                <ConsumptionChart data={chartData} />
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No data yet. Start logging your water intake!</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
