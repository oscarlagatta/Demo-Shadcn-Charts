"use client"

import { useState, useEffect, useMemo } from "react"
import type { MetricData, GridRowData, MonthColumn, SltResponse, PendingAction } from "./types"
import { getMonthNameByIndex } from "./utils"

export const useGridData = (
  sixMonthByMetricPerformance: MetricData[] | null,
  allUniqueMonths: string[],
  selectedMonth?: string,
  selectedMetricId?: number | null,
  sltMetricPerformance?: SltResponse | null,
  isSltDataLoading?: boolean,
  pendingAction?: PendingAction | null,
  expandedMetrics?: number[],
) => {
  const [gridData, setGridData] = useState<GridRowData[]>([])

  // Initialize grid data with sixMonthByMetricPerformance
  useEffect(() => {
    if (sixMonthByMetricPerformance && allUniqueMonths.length > 0) {
      const baseData = sixMonthByMetricPerformance.map((metric: MetricData) => {
        // Create a base row with metric data
        const baseRow: GridRowData = {
          metricId: metric.metricId,
          metricPrefix: metric.metricPrefix,
          metricName: metric.metricName,
          valueType: metric.valueType,
          metricDescription: metric.metricDescription,
          metricCalculation: metric.metricCalculation,
          serviceAlignment: metric.serviceAlignment,
          trigger: metric.trigger,
          limit: metric.limit,
          source: metric.source,
          metricType: metric.metricType,
          isParent: true,
        }

        // Create a map of month to month data for quick lookup
        const monthDataMap = new Map<string, any>()
        metric.monthlyData.forEach((monthData) => {
          monthDataMap.set(monthData.month, monthData)
        })

        // Add data for all unique months, using NDTR for missing months
        allUniqueMonths.forEach((month, index) => {
          const monthIndex = index + 1 // 1-based index
          const monthName = getMonthNameByIndex(monthIndex)

          if (monthName) {
            const monthData = monthDataMap.get(month)

            if (monthData) {
              // Month data exists for this metric
              baseRow[`${monthName}Month`] = month
              baseRow[`${monthName}Month_Result`] = monthData.result
              baseRow[`${monthName}Month_Color`] = monthData.color
            } else {
              // No data for this month, set NDTR
              baseRow[`${monthName}Month`] = month
              baseRow[`${monthName}Month_Result`] = "NDTR"
              baseRow[`${monthName}Month_Color`] = "grey"
            }
          }
        })

        return baseRow
      })

      setGridData(baseData)
    }
  }, [sixMonthByMetricPerformance, allUniqueMonths])

  // Process SLT data when it's loaded
  useEffect(() => {
    if (
      sltMetricPerformance &&
      sltMetricPerformance.sltData &&
      selectedMetricId &&
      !isSltDataLoading &&
      pendingAction?.type === "expand" &&
      pendingAction.metricId === selectedMetricId
    ) {
      // create a new grid data array without modifying the existing one
      const baseGrid = [...gridData]

      // Find the parent row index
      const parentIndex = baseGrid.findIndex((row) => row.metricId === selectedMetricId && row.isParent)

      if (parentIndex !== -1) {
        // create child rows
        const childRows = sltMetricPerformance.sltData.map((slt) => {
          // Create a base row with SLT data
          const childRow: GridRowData = {
            metricId: selectedMetricId,
            isParent: false,
            sltName: slt.sltName,
            sltNBId: slt.sltNbkId,
          }

          // Create a map of month to month data for quick lookup
          const monthDataMap = new Map<string, any>()
          slt.sltMonthlyData.forEach((monthData) => {
            monthDataMap.set(monthData.month, monthData)
          })

          // Add data for all unique months, using NDTR for missing months
          allUniqueMonths.forEach((month, index) => {
            const monthIndex = index + 1 // 1-based index
            const monthName = getMonthNameByIndex(monthIndex)

            if (monthName) {
              const monthData = monthDataMap.get(month)

              if (monthData) {
                // Month data exists for this SLT
                childRow[`${monthName}Month`] = month
                childRow[`${monthName}Month_Result`] = monthData.result
                childRow[`${monthName}Month_Color`] = monthData.color
              } else {
                // No data for this month, set NDTR
                childRow[`${monthName}Month`] = month
                childRow[`${monthName}Month_Result`] = "NDTR"
                childRow[`${monthName}Month_Color`] = "grey"
              }
            }
          })

          return childRow
        })

        // Insert child rows after the parent
        const newGridData = [...baseGrid.slice(0, parentIndex + 1), ...childRows, ...baseGrid.slice(parentIndex + 1)]

        setGridData(newGridData)
      }
    }
  }, [
    sltMetricPerformance,
    selectedMetricId,
    isSltDataLoading,
    pendingAction,
    gridData,
    expandedMetrics,
    allUniqueMonths,
  ])

  // Process collapse action
  useEffect(() => {
    if (pendingAction?.type === "collapse") {
      const metricId = pendingAction.metricId

      // Remove child rows
      setGridData((prev) => prev.filter((row) => !(row.metricId === metricId && !row.isParent)))
    }
  }, [pendingAction])

  // Get available months for display
  const monthColumns = useMemo<MonthColumn[]>(() => {
    if (!allUniqueMonths || allUniqueMonths.length === 0) return []

    // If a specific month is selected, only show that month
    if (selectedMonth) {
      const filteredMonths = allUniqueMonths.filter((month: string) => month.startsWith(selectedMonth))

      return filteredMonths.map((month: string, index: number) => {
        const monthName = getMonthNameByIndex(index + 1)
        return {
          month,
          result: `${monthName}Month_Result`,
        }
      })
    }

    // Return all available months (either 6 or 13 based on the toggle)
    return allUniqueMonths.map((month: string, index: number) => {
      const monthName = getMonthNameByIndex(index + 1)
      return {
        month,
        result: `${monthName}Month_Result`,
      }
    })
  }, [allUniqueMonths, selectedMonth])

  return { gridData, setGridData, monthColumns }
}
