"use client";

import { useHydration } from "@/hooks/use-hydration";
import { ProgressView } from "@/components/progress-view";
import { LogIntake } from "@/components/log-intake";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets } from "lucide-react";

export function DashboardClient() {
  const { isLoading, totalToday, settings } = useHydration();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Skeleton className="w-64 h-64 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const remaining = Math.max(0, settings.dailyGoal - totalToday);
  const glassesRemaining = remaining > 0 ? Math.ceil(remaining / 250) : 0;
  
  let encouragement = "Anda hebat! Teruslah minum.";
  if (remaining > 0) {
    encouragement = `Tinggal ${remaining.toLocaleString()}ml lagi. Sekitar ${glassesRemaining} gelas kecil lagi!`;
  } else {
    encouragement = "Target tercapai! Kerja bagus untuk tetap terhidrasi.";
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="grid lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-2 flex justify-center">
          <ProgressView />
        </div>
        <div className="lg:col-span-3 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Droplets className="mr-2 text-accent" />Target Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                {encouragement}
              </CardDescription>
            </CardContent>
          </Card>
          <LogIntake />
        </div>
      </div>
    </div>
  );
}
