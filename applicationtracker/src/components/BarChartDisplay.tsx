"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type BarChartDisplayProps = {
  data: { day: string; desktop: number }[];
};

const chartConfig = {
  desktop: {
    label: "Applications",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BarChartDisplay({ data }: BarChartDisplayProps) {
  return (
    <Card className="flex flex-col py-5 text-center min-w-100 max-w-125 max-h-122">
      <CardHeader>
        <CardTitle className="text-indigo-100">Applications This Week</CardTitle>
        <CardDescription className="text-indigo-300">
          Weekly Application Activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            className="fill-indigo-100"
            accessibilityLayer
            data={data}
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value} 
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" radius={8} className="fill-indigo-300">
              <LabelList
                dataKey="desktop"
                position="top"
                offset={12}
                className="fill-indigo-100"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
