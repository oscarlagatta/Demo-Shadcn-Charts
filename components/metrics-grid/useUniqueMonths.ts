"use client"

import { useState, useEffect } from "react"
import type { MetricData } from "./types"

export const useUniqueMonths = (sixMonthByMetricPerformance: MetricData[] | null, showExtendedMonths = false) => {
  const [allUniqueMonths, setAllUniqueMonths] = useState<string[]>([])

  // Collect all unique months across all metrics
  useEffect(() => {
    if (sixMonthByMetricPerformance && sixMonthByMetricPerformance.length > 0) {
      const uniqueMonths = new Set<string>()

      // Loop through all metrics to collect all available months
      sixMonthByMetricPerformance.forEach((metric: MetricData) => {
        metric.monthlyData.forEach((monthData) => {
          uniqueMonths.add(monthData.month)
        })
      })

      // Convert to array and sort (newest first)
      const sortedMonths = Array.from(uniqueMonths).sort(
        (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime(),
      )

      // Limit to either 6 or 13 most recent months based on toggle
      const limitedMonths = sortedMonths.slice(0, showExtendedMonths ? 13 : 6)

      setAllUniqueMonths(limitedMonths)
    }
  }, [sixMonthByMetricPerformance, showExtendedMonths])

  return allUniqueMonths
}
