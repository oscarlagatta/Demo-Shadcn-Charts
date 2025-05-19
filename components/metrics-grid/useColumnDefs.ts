"use client"

import { useMemo } from "react"
import type { ColDef } from "ag-grid-community"
import type { MonthColumn, PendingAction } from "./types"
import { ServiceAlignmentCell } from "./cell-renderers/ServiceAlignmentCell"
import { MetricCell } from "./cell-renderers/MetricCell"
import { ThresholdsCell } from "./cell-renderers/ThresholdsCell"
import { MonthCell } from "./cell-renderers/MonthCell"
import { getCellColor } from "./utils"

export const useColumnDefs = (
  monthColumns: MonthColumn[],
  expandedMetrics: number[],
  isSltDataLoading: boolean,
  selectedMetricId: number | null,
  handleToggleRow: (metricId: number) => void,
  pendingAction: PendingAction | null,
  metricPerformanceColors: any,
  isSmallScreen = false,
) => {
  return useMemo<ColDef[]>(
    () => [
      {
        headerName: "Service Alignment",
        field: "serviceAlignment",
        cellRenderer: (params) => (
          <ServiceAlignmentCell
            {...params}
            expandedMetrics={expandedMetrics}
            pendingAction={pendingAction}
            selectedMetricId={selectedMetricId}
            isSltDataLoading={isSltDataLoading}
            handleToggleRow={handleToggleRow}
          />
        ),
        flex: isSmallScreen ? 1.5 : 2,
        filter: "agTextColumnFilter",
        pinned: "left", // Pin this column to the left
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
        headerClass: "custom-header",
        minWidth: 150,
      },
      {
        headerName: "Metric",
        field: "metricName",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: MetricCell,
        pinned: "left", // Pin this column to the left
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
        headerClass: "custom-header",
        minWidth: 120,
      },
      {
        headerName: "Metric Type",
        field: "metricType",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params) => {
          return params.data?.isParent ? params.value : ""
        },
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
        headerClass: "custom-header",
        minWidth: 100,
        hide: isSmallScreen, // Hide on small screens
      },
      {
        headerName: "Thresholds",
        field: "trigger", // Using trigger as the base field
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: ThresholdsCell,
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
        headerClass: "custom-header",
        minWidth: 100,
      },
      {
        headerName: "Source",
        field: "source",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (params) => {
          return params.data?.isParent ? params.value : ""
        },
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
        headerClass: "custom-header",
        minWidth: 100,
        hide: isSmallScreen, // Hide on small screens
      },
      ...monthColumns.map(({ month, result }) => ({
        headerClass: "custom-header text-center month-column",
        headerName: month
          ? isSmallScreen
            ? new Date(month).toLocaleDateString("en-US", { month: "short" }) // Shorter format for small screens
            : new Date(month).toLocaleDateString("en-US", { year: "numeric", month: "short" })
          : "N/A",
        field: result,
        flex: 0.8,
        cellStyle: (params: any) => {
          const backgroundColor = getCellColor(params, metricPerformanceColors)

          return {
            textAlign: "center",
            backgroundColor: backgroundColor,
            color: !params.value || params.value === "NDTR" ? "gray" : "black",
            border: "1px solid #000000", // Black border for all cells
            padding: isSmallScreen ? "2px" : "8px", // Smaller padding on small screens
          }
        },
        valueFormatter: (params: any) => {
          if (!params.value) return "NDTR"
          return params.value
        },
        cellRenderer: MonthCell,
        filter: "agTextColumnFilter",
        minWidth: isSmallScreen ? 80 : 100,
        maxWidth: isSmallScreen ? 100 : 150,
      })),
    ],
    [
      monthColumns,
      expandedMetrics,
      isSltDataLoading,
      selectedMetricId,
      handleToggleRow,
      pendingAction,
      metricPerformanceColors,
      isSmallScreen,
    ],
  )
}
