"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BarChartDisplayProps {
  data?: { day: string; desktop: number }[];
}

// Default fallback data
const defaultChartData = [
  { month: "Mon", desktop: 4 },
  { month: "Tues", desktop: 10 },
  { month: "Wed", desktop: 14 },
  { month: "Thurs", desktop: 20 },
  { month: "Fri", desktop: 10 },
  { month: "Sat", desktop: 4 },
  { month: "Sun", desktop: 0 },
]

const chartConfig = {
  desktop: {
    label: "Applications",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function BarChartDisplay({ data }: BarChartDisplayProps) {
  const chartData = data || defaultChartData;
      console.log(data);

  return (
    <Card className="flex flex-col py-3 text-center max-w-250 bg-white/10 shadow-none">
      <CardContent>
        <ChartContainer config={chartConfig} >
        <BarChart
            className="fill-[#8B7EC8]"
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              />

            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            /> */}
            <Bar dataKey="desktop" radius={8} className="">
              <LabelList
                position="top"
                offset={10}
                className="fill-black"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}