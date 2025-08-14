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
const chartData = [
    { day: "Mon", desktop: 4 },
  { day: "Tues", desktop: 10 },
  { day: "Wed", desktop: 14 },
  { day: "Thurs", desktop: 20 },
  { day: "Fri", desktop: 10 },
  { day: "Sat", desktop: 4 },
  { day: "Sun", desktop: 0 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function BarChartDisplay() {
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
              dataKey="day"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(0, 3)}
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