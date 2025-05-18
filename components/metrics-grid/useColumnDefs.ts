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
        flex: 2,
        filter: "agTextColumnFilter",
        pinned: "left", // Pin this column to the left
        cellStyle: {
          border: "1px solid #000000", // Black border for all cells
        },
        headerClass: "custom-header",
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
      },
      ...monthColumns.map(({ month, result }) => ({
        headerClass: "custom-header text-center",
        headerName: month ? new Date(month).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "N/A",
        field: result,
        flex: 1,
        cellStyle: (params: any) => {
          const backgroundColor = getCellColor(params, metricPerformanceColors)

          return {
            textAlign: "center",
            backgroundColor: backgroundColor,
            color: !params.value || params.value === "NDTR" ? "gray" : "black",
            border: "1px solid #000000", // Black border for all cells
          }
        },
        valueFormatter: (params: any) => {
          if (!params.value) return "NDTR"
          return params.value
        },
        cellRenderer: MonthCell,
        filter: "agTextColumnFilter",
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
    ],
  )
}
