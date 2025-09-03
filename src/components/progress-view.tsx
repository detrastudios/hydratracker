"use client";

import { useHydration } from "@/hooks/use-hydration";

export function ProgressView() {
  const { progress, totalToday, settings, isLoading } = useHydration();

  if (isLoading) {
    return <div className="aspect-square w-full max-w-sm mx-auto bg-muted rounded-full animate-pulse" />;
  }
  
  const fillHeight = `${progress}%`;

  return (
    <div className="relative w-full max-w-xs mx-auto aspect-[3/4]">
      <svg
        viewBox="0 0 150 200"
        className="w-full h-full"
        aria-labelledby="progress-title progress-desc"
        role="img"
      >
        <title id="progress-title">Water Intake Progress</title>
        <desc id="progress-desc">
          A glass filling with water, showing you have consumed {totalToday}ml of your {settings.dailyGoal}ml goal.
        </desc>
        
        {/* Water fill with animation */}
        <g clipPath="url(#glass-path)">
          <rect
            x="5"
            y="190"
            width="140"
            height="180"
            className="fill-primary/20"
          />
          <rect
            x="5"
            y="190"
            width="140"
            height="180"
            className="fill-primary transition-transform duration-1000 ease-out"
            style={{ transform: `translateY(-${(180 * progress) / 100}px)` }}
          />
          {/* Wave effect */}
          <path
            d="M 0 10 C 37.5 20, 112.5 0, 150 10 L 150 0 L 0 0 Z"
            className="fill-primary transition-transform duration-1000 ease-out"
            style={{ transform: `translateY(${190 - (180 * progress) / 100}px)` }}
          />
        </g>
        
        {/* Glass outline */}
        <defs>
          <clipPath id="glass-path">
            <path
              d="M 20 10 C 20 10, 20 0, 30 0 L 120 0 C 130 0, 130 10, 130 10 L 145 190 C 145 200, 135 200, 125 200 L 25 200 C 15 200, 5 200, 5 190 Z"
            />
          </clipPath>
        </defs>
        <path
          d="M 20 10 C 20 10, 20 0, 30 0 L 120 0 C 130 0, 130 10, 130 10 L 145 190 C 145 200, 135 200, 125 200 L 25 200 C 15 200, 5 200, 5 190 Z"
          className="stroke-foreground/30"
          strokeWidth="3"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-5xl font-bold text-primary-foreground drop-shadow-lg" style={{ mixBlendMode: 'difference', filter: 'invert(1)' }}>
          {Math.round(progress)}%
        </span>
        <span className="font-semibold text-foreground/80 mt-2">
          {totalToday.toLocaleString()} / {settings.dailyGoal.toLocaleString()} ml
        </span>
      </div>
    </div>
  );
}
