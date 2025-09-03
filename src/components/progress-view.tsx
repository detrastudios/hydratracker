"use client";

import { useHydration } from "@/hooks/use-hydration";

export function ProgressView() {
  const { progress, totalToday, settings, isLoading } = useHydration();

  if (isLoading) {
    return <div className="aspect-square w-full max-w-sm mx-auto bg-muted rounded-full animate-pulse" />;
  }
  
  const fillHeight = `${progress}%`;

  return (
    <div className="relative w-full max-w-xs mx-auto aspect-square">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        aria-labelledby="progress-title progress-desc"
        role="img"
      >
        <title id="progress-title">Progres Asupan Air</title>
        <desc id="progress-desc">
          Sebuah lingkaran progres menunjukkan Anda telah mengonsumsi {totalToday}ml dari target {settings.dailyGoal}ml.
        </desc>
        <circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-muted"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-primary transition-all duration-1000 ease-out"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray="282.74"
          strokeDashoffset={282.74 * (1 - progress / 100)}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-5xl font-bold text-primary">
          {Math.round(progress)}%
        </span>
        <span className="font-semibold text-foreground/80 mt-2">
          {totalToday.toLocaleString()} / {settings.dailyGoal.toLocaleString()} ml
        </span>
      </div>
    </div>
  );
}
