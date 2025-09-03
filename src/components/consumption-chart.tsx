"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartData = {
  label: string;
  intake: number;
}[];

const chartConfig = {
  intake: {
    label: "Intake (ml)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ConsumptionChart({ data }: { data: ChartData }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => `${value}ml`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="intake" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
