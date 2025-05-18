"use client"

import type React from "react"
import { useCallback, useEffect, useState, useRef } from "react"
import { AgGridReact } from "ag-grid-react"
import type { GetRowIdParams } from "ag-grid-community"

import { useDashboardData } from "@bofa/data-services"
import { metricPerformanceColors } from "@bofa/util"

import type { MetricsGridProps, PendingAction } from "./types"
import { renderLoadingSpinner } from "./LoadingSpinner"
import { useUniqueMonths } from "./useUniqueMonths"
import { useGridData } from "./useGridData"
import { useColumnDefs } from "./useColumnDefs"
import { useGridStyles } from "./useGridStyles"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

const MetricsGrid: React.FC<MetricsGridProps> = ({ selectedMonth, selectedLeader, metricTypeId }) => {
  const gridApiRef = useRef<any>(null)
  const [expandedMetrics, setExpandedMetrics] = useState<number[]>([])
  const [selectedMetricId, setSelectedMetricId] = useState<number | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGridMounted, setIsGridMounted] = useState(false)

  // Pass selectedLeader and selectedMonth to the useDashboardData hook
  const { sixMonthByMetricPerformance, useGetSltMetricPerformance, sixMonthByMetricPerformanceQuery } =
    useDashboardData(selectedMonth, selectedLeader?.id, metricTypeId)

  // Reset expanded metrics with filters change
  useEffect(() => {
    setExpandedMetrics([])
    setSelectedMetricId(null)
    setPendingAction(null)
  }, [selectedLeader, selectedMonth, metricTypeId])

  // Pass selectedLeader and selectedMonth to the useGetSltMetricPerformance hook
  const { data: sltMetricPerformance, isLoading: isSltDataLoading } = useGetSltMetricPerformance(
    selectedMetricId ?? 0,
    selectedMonth ?? undefined,
    selectedLeader?.id ?? undefined,
  ) as {
    data: any | null
    isLoading: boolean
  }

  // Update loading state
  useEffect(() => {
    setIsLoading(sixMonthByMetricPerformanceQuery.isLoading)
  }, [sixMonthByMetricPerformanceQuery.isLoading])

  // Get all unique months
  const allUniqueMonths = useUniqueMonths(sixMonthByMetricPerformance)

  // Get grid data and month columns
  const { gridData, setGridData, monthColumns } = useGridData(
    sixMonthByMetricPerformance,
    allUniqueMonths,
    selectedMonth,
    selectedMetricId,
    sltMetricPerformance,
    isSltDataLoading,
    pendingAction,
    expandedMetrics,
  )

  // Handle row toggle (expand/collapse)
  const handleToggleRow = useCallback(
    (metricId: number) => {
      // If there's already a pending action, ignore this click
      if (pendingAction !== null) return

      if (expandedMetrics.includes(metricId)) {
        // Collapse: Set a pending collapse action
        setPendingAction({ type: "collapse", metricId })
        // Remove expanded metrics
        setExpandedMetrics((prev) => prev.filter((id) => id !== metricId))
        // Clear the pending action after state updates
        setTimeout(() => setPendingAction(null), 0)
      } else {
        // Expand: set the selected metric ID and a pending expand action
        setSelectedMetricId(metricId)
        setPendingAction({ type: "expand", metricId })
        // Add to expanded metrics if not already loading SLT data
        if (!isSltDataLoading) {
          setExpandedMetrics((prev) => [...prev, metricId])
        }
      }
    },
    [expandedMetrics, pendingAction, isSltDataLoading],
  )

  // Get column definitions
  const columnDefs = useColumnDefs(
    monthColumns,
    expandedMetrics,
    isSltDataLoading,
    selectedMetricId,
    handleToggleRow,
    pendingAction,
    metricPerformanceColors,
  )

  // Default column definitions
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }

  // Set grid mounted state
  useEffect(() => {
    setIsGridMounted(true)
  }, [])

  // Apply grid styles
  useGridStyles(isGridMounted)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (gridApiRef.current) {
        gridApiRef.current.sizeColumnsToFit()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Get row ID for AG Grid
  const getRowId = (params: GetRowIdParams) => {
    return params.data.isParent
      ? `metric-${params.data.metricId}`
      : `slt-${params.data.metricId}-${params.data.sltNBId}`
  }

  // Grid ready event handler
  const onGridReady = useCallback((params: any) => {
    gridApiRef.current = params.api
  }, [])

  // First data rendered event handler
  const onFirstDataRendered = useCallback(() => {
    if (gridApiRef.current) {
      // Fit columns to their content
      gridApiRef.current.sizeColumnsToFit()

      // Ensure the grid fits its container
      setTimeout(() => {
        gridApiRef.current.sizeColumnsToFit()
      }, 100)
    }
  }, [])

  // Show loading spinner if data is loading
  if (isLoading) {
    return renderLoadingSpinner()
  }

  return (
    <div className="ag-theme-alpine w-full h-full">
      <div className="w-full h-full overflow-auto scrollbar-hide">
        <AgGridReact
          key={`metrics-grid-${metricTypeId || "all"}`}
          rowData={gridData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          suppressRowTransform={true}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>
    </div>
  )
}

export default MetricsGrid
