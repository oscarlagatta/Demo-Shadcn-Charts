"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import dayjs from "dayjs"

import { useMemo } from "react"
import { MetricTypeModel, useNonGreenMetricsLast2MonthData } from "@/utils/data-services"


type NonGreenMetricProps = {
  selectedMonth?: string
  selectedMetricType?: Partial<MetricTypeModel> | null
}

// Data structure type based on the API response
type NonGreenMetricData = {
  metricId: number
  metricPrefix: string
  metricName: string
  currentValue: string | null
  previousValue: string | null
  change: string
  isImproving: boolean
  color: string
  arrowColor?: string
  breachesCount?: number
  portfolioCount?: number
  berachesCount?: number // Handle typo in the API response
}

export default function NonGreenMetrics({ selectedMonth, selectedMetricType }: NonGreenMetricProps) {
  const previousMonth = dayjs().subtract(1, "month")
  const defaultMonth = previousMonth.format("YYYY-MM")

  const effectiveMonth = selectedMonth || defaultMonth

  // Use the data service hook to get non-green metrics
  const { sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery } = useNonGreenMetricsLast2MonthData(
    effectiveMonth,
    undefined,
    selectedMetricType?.id,
  )

  const { nonGreenMetrics, isLoading } = useMemo(() => {
    if (
      sixMonthByMetricPerformanceQuery.isLoading ||
      !sixMonthByMetricPerformance ||
      sixMonthByMetricPerformance.length === 0
    ) {
      return {
        nonGreenMetrics: [],
        isLoading: true,
      }
    }

    // The data is already in the format we need, just need to sort it
    const nonGreenMetrics = sixMonthByMetricPerformance
      // sort by color (red first, then amber) and then by performance value (ascending)
      .sort((a, b) => {
        if (a.color === "#e61622" && b.color !== "#e61622") return -1
        if (a.color !== "#e61622" && b.color === "#e61622") return 1

        // Handle null values for sorting
        const aValue = a.currentValue ? Number.parseFloat(a.currentValue) : 0
        const bValue = b.currentValue ? Number.parseFloat(b.currentValue) : 0

        return aValue - bValue
      })

    return {
      nonGreenMetrics,
      isLoading: false,
    }
  }, [sixMonthByMetricPerformance, sixMonthByMetricPerformanceQuery.isLoading])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="shadow-xl transition-shadow duration-300 hover:shadow-2xl">
      <CardHeader>
        <CardTitle>Non-Green Metrics {selectedMonth ? `(${selectedMonth})` : "(All Months)"}</CardTitle>
        <CardDescription>
          Metrics not meeting target performance (Red and Amber) with month-over-month trend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {nonGreenMetrics.length > 0 ? (
          <div className="max-h-[600px] space-y-4 overflow-y-auto p-0">
            {nonGreenMetrics.map((metric) => (
              <MetricCard key={metric.metricId} metric={metric} />
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-gray-500">No non-green metrics for the selected month.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MetricCard({ metric }: { metric: NonGreenMetricData }) {
  // Get the breaches count, handling the typo in the API response
  const breachesCount = metric.breachesCount || metric.berachesCount || 0

  // Format the current value for display
  const displayValue = metric.currentValue ? Number.parseFloat(metric.currentValue).toFixed(2) : "N/A"

  // Format the change value for display
  const changeValue = metric.change ? Number.parseFloat(metric.change).toFixed(2) : "0.00"

  return (
    <div className="relative cursor-pointer rounded-md border border-gray-200 bg-gray-50 p-4 transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:border-gray-300 hover:bg-white hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900">
            {metric.metricPrefix} {metric.metricName}
          </h3>

          <p className="text-sm text-gray-500">
            {breachesCount} record(s) across {metric.portfolioCount || 0} leader(s)
          </p>
        </div>
        <div
          className={`rounded-md px-3 py-1 font-medium text-white ${
            metric.color === "#e61622" ? "bg-red-600" : "bg-amber-500"
          }`}
        >
          {displayValue}
        </div>
      </div>

      <div className="mt-2 flex items-center text-sm">
        <span className="mr-2">vs. previous month:</span>
        <span className={`flex items-center ${metric.isImproving ? "text-green-600" : "text-red-600"}`}>
          {metric.isImproving ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
          {changeValue}%
        </span>
      </div>
    </div>
  )
}
