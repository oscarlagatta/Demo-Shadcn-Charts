"use client"

import { useDashboardData } from "@bofa/data-services"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Rectangle,
} from "recharts"

// Define the new API response structure
interface MonthData {
  month: string
  numerator: string
  denominator: string
  result: string
  color: string
  updatedDateTime: string | null
}

interface MetricData {
  metricId: number
  metricPrefix: string
  metricName: string
  valueType: string
  metricDescription: string
  metricCalculation: string
  serviceAlignment: string
  trigger: number
  limit: number
  source: string
  metricType: string
  thresholdDirection: string | null
  monthlyData: MonthData[]
}

type MetricTypeModel = {
  id?: number
  name?: string
  description?: string
  status?: boolean
  createdUserId?: number
  createdDateTime?: string | null
  createdBy?: string | null
  updatedBy?: string | null
  updatedUserId?: number
  updatedDateTime?: string | null
}

const formatMonth = (monthStr: string) => {
  if (!monthStr) return ""

  const [year, month] = monthStr.split("-")
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Convert month string to number and subtract 1 for zero-based index
  const monthIndex = Number.parseInt(month, 10) - 1

  // Format as 'MMM-YY'
  return `${monthNames[monthIndex]}-${year.slice(2)}`
}

// Custom shape for the bubble vial effect with enhanced gradients
const BubbleBar = (props: any) => {
  const { x, y, width, height, fill, radius = 0 } = props

  // Calculate the actual height to ensure it's at least 1px
  const actualHeight = Math.max(height, 1)

  // Calculate the actual y position
  const actualY = y + (height - actualHeight)

  // Create unique gradient IDs based on the fill color and position
  const gradientId = `bubbleGradient-${fill.replace("#", "")}-${x}-${y}`

  // Define gradient colors based on the fill
  let gradientColors = {
    lighter: fill,
    main: fill,
    darker: fill,
    highlight: "rgba(255,255,255,0.7)",
  }

  // Apply rounded top only for red bars
  let topRadius = 0 // Default to square top
  if (fill === "#e61622") {
    topRadius = 12 // Rounded top only for red bars
  }

  // Customize gradient colors based on the base color
  if (fill === "#009223") {
    // Green - subtle horizontal gradient from lighter green to correct green
    gradientColors = {
      lighter: "#4db356", // Lighter green
      main: "#009223", // Correct green
      darker: "#009223", // Same as main for subtle effect
      highlight: "rgba(255,255,255,0.5)",
    }
  } else if (fill === "#ffbf00") {
    // Amber
    gradientColors = {
      lighter: "#ffbf00",
      main: "#ffbf00",
      darker: "#ffbf00",
      highlight: "rgba(255,255,255,0.5)",
    }
  } else if (fill === "#e61622") {
    // Red
    gradientColors = {
      lighter: "#e61622",
      main: "#e61622",
      darker: "#e61622",
      highlight: "rgba(255,255,255,0.5)",
    }
  }

  return (
    <g>
      <defs>
        {/* Horizontal gradient for green bars, solid color for others */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          {fill === "#009223" ? (
            // Subtle horizontal gradient for green bars
            <>
              <stop offset="0%" stopColor={gradientColors.lighter} stopOpacity={0.9} />
              <stop offset="100%" stopColor={gradientColors.main} stopOpacity={1} />
            </>
          ) : (
            // Solid color for other bars
            <>
              <stop offset="0%" stopColor={fill} stopOpacity={0.95} />
              <stop offset="100%" stopColor={fill} stopOpacity={0.95} />
            </>
          )}
        </linearGradient>
      </defs>

      {/* Main bar with gradient */}
      <Rectangle
        x={x}
        y={actualY}
        width={width}
        height={actualHeight}
        fill={`url(#${gradientId})`}
        stroke={fill}
        strokeWidth={0.5}
        radius={[topRadius, topRadius, 0, 0]}
      />

      {/* Glass reflection effect - top highlight */}
      <path
        d={`M ${x + 2} ${actualY + 2} 
            L ${x + width - 2} ${actualY + 2} 
            Q ${x + width - 4} ${actualY + 6} ${x + width - 8} ${actualY + 6}
            L ${x + 8} ${actualY + 6}
            Q ${x + 4} ${actualY + 6} ${x + 2} ${actualY + 2}`}
        fill={gradientColors.highlight}
        opacity={0.7}
      />
    </g>
  )
}

interface MetricPerformanceTrendProps {
  selectedMonth?: string
  selectedMetricType?: Partial<MetricTypeModel> | null
  selectedLeader?: { id: string; name: string } | null
}

export default function MetricPerformanceTrend({
  selectedMonth,
  selectedMetricType,
  selectedLeader,
}: MetricPerformanceTrendProps) {
  const { sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery } = useDashboardData(
    selectedMonth,
    selectedLeader?.id,
    selectedMetricType?.id,
  )

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!sixMonthByMetricPerformance || sixMonthByMetricPerformance.length === 0) {
      return []
    }

    // Get all unique months from all metrics' monthlyData
    const allMonths = new Set<string>()

    // Collect all months from all metrics
    sixMonthByMetricPerformance.forEach((metric: MetricData) => {
      metric.monthlyData.forEach((monthData) => {
        allMonths.add(monthData.month)
      })
    })

    // Convert to array and sort by date (newest first)
    const sortedMonths = Array.from(allMonths).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    // Limit to 12 months if there are more
    const months = sortedMonths.slice(0, 12)

    return months
      .map((monthStr) => {
        // For each month, count the number of metrics in each status
        let greenCount = 0
        let amberCount = 0
        let redCount = 0
        let greyCount = 0

        // Count metrics by status for this month
        sixMonthByMetricPerformance.forEach((metric: MetricData) => {
          // Find the month data for this specific month
          const monthData = metric.monthlyData.find((md) => md.month === monthStr)

          if (!monthData) {
            greyCount++
            return
          }

          const color = monthData.color

          // Guard against null or undefined color values
          if (!color) {
            greyCount++
            return
          }

          // Case-insensitive comparison
          const colorLower = color.toLowerCase()

          if (colorLower === "#009223" || colorLower === "green") greenCount++
          else if (colorLower === "#ffbf00" || colorLower === "amber") amberCount++
          else if (colorLower === "#e61622" || colorLower === "red") redCount++
          else greyCount++
        })

        const totalCount = greenCount + amberCount + redCount + greyCount
        const countExcludingGrey = greenCount + amberCount + redCount

        const greenPercentage = countExcludingGrey > 0 ? Math.round((greenCount / countExcludingGrey) * 100) : 0

        return {
          month: formatMonth(monthStr),
          Green: greenCount,
          Amber: amberCount,
          Red: redCount,
          Grey: greyCount,
          Total: totalCount,
          GreenPercentage: greenPercentage,
          rawMonth: monthStr, // Keep the raw month for sorting
        }
      })
      .sort((a, b) => new Date(a.rawMonth).getTime() - new Date(b.rawMonth).getTime()) // Sort by date (oldest first)
  }, [sixMonthByMetricPerformance])

  // Calculate the maximum count for the y-axis
  const maxCount = useMemo(() => {
    if (chartData.length === 0) return 30 // Default max if no data

    const maxTotal = Math.max(...chartData.map((item) => item.Total))
    // Round up to the nearest 5
    return Math.ceil(maxTotal / 5) * 5
  }, [chartData])

  // Loading skeleton for the chart
  const renderLoadingSkeleton = () => {
    return (
      <Card className="shadow-xl transition-shadow duration-300 hover:shadow-2xl">
        <CardHeader>
          <div className="h-7 w-64 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-5 w-96 animate-pulse rounded-md bg-gray-200 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 flex h-[600px] w-full items-center justify-center rounded-md border border-gray-200 shadow-inner">
            {/* Skeleton for Y-axis */}
            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 space-y-16">
              {[...Array(5)].map((_, i) => (
                <div key={`y-tick-${i}`} className="h-4 w-8 animate-pulse rounded-md bg-gray-200"></div>
              ))}
            </div>

            {/* Skeleton for X-axis */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-12">
              {[...Array(6)].map((_, i) => (
                <div key={`x-tick-${i}`} className="h-4 w-12 animate-pulse rounded-md bg-gray-200"></div>
              ))}
            </div>

            {/* Skeleton for bars */}
            <div className="flex h-3/4 items-end space-x-12 px-16">
              {[...Array(6)].map((_, i) => (
                <div key={`bar-group-${i}`} className="flex flex-col items-center space-y-1">
                  <div
                    className="w-16 animate-pulse rounded-t-md bg-red-400"
                    style={{ height: `${20 + Math.random() * 30}px` }}
                  ></div>
                  <div
                    className="w-16 animate-pulse bg-amber-400"
                    style={{ height: `${30 + Math.random() * 40}px` }}
                  ></div>
                  <div
                    className="w-16 animate-pulse bg-green-600"
                    style={{ height: `${50 + Math.random() * 100}px` }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Skeleton for line */}
            <div className="absolute top-1/3 left-0 right-0 h-0.5 w-full">
              <div className="relative h-0.5 w-full bg-gray-300">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`dot-${i}`}
                    className="absolute h-3 w-3 animate-pulse rounded-full bg-gray-700"
                    style={{ left: `${(i + 0.5) * (100 / 6)}%`, top: "-4px" }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if data is loading
  if (sixMonthByMetricPerformanceQuery.isLoading || !sixMonthByMetricPerformance) {
    return renderLoadingSkeleton()
  }

  return (
    <Card className="shadow-xl transition-shadow duration-300 hover:shadow-2xl">
      <CardHeader>
        <CardTitle>
          Metric Performance Trend
          {selectedMetricType ? ` - ${selectedMetricType.name}` : ""}
          {selectedLeader ? ` - ${selectedLeader.name}` : ""}
          {selectedMonth ? ` - (${selectedMonth})` : " (All Months - Trend across all months)"}
        </CardTitle>
        <CardDescription>
          {chartData.length <= 6 ? "Six" : "Twelve"}-month trend showing metric status distribution and percentage of
          metrics meeting target (Green).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 flex h-[600px] w-full items-center justify-center rounded-md border border-gray-200 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 30,
                right: 40,
                left: 10,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                tickLine={false}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={[0, maxCount]}
                tick={{ fontSize: 12 }}
                tickCount={7}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                tickCount={6}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e0e0e0",
                }}
                formatter={(value, name) => {
                  if (name === "GreenPercentage") {
                    return [`${value}%`, "% Green"]
                  }
                  return [value, name]
                }}
                labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ paddingTop: "15px" }}
                formatter={(value) => <span style={{ color: "#555", fontSize: "12px" }}>{value}</span>}
              />
              <Bar
                yAxisId="left"
                dataKey="Green"
                stackId="a"
                fill="#009223"
                name="Green"
                shape={<BubbleBar />}
                animationDuration={1500}
              />
              <Bar
                yAxisId="left"
                dataKey="Amber"
                stackId="a"
                fill="#ffbf00"
                name="Amber"
                shape={<BubbleBar />}
                animationDuration={1500}
              />
              <Bar
                yAxisId="left"
                dataKey="Red"
                stackId="a"
                fill="#e61622"
                name="Red"
                shape={<BubbleBar />}
                animationDuration={1500}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="GreenPercentage"
                stroke="#000000"
                strokeWidth={2}
                name="% Green"
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#000" }}
                label={{
                  position: "top",
                  formatter: (value: number) => `${value}%`,
                  fontSize: 12,
                  fill: "#000000",
                  fontWeight: "bold",
                }}
                animationDuration={2000}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
