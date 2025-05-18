"use client"

import type React from "react"
import type { ICellRendererParams } from "ag-grid-community"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { GridRowData } from "../types"
import { MetricTooltip } from "../../MetricTooltip"
import { LoadingSpinner } from "../LoadingSpinner"

interface ServiceAlignmentCellProps extends ICellRendererParams {
  expandedMetrics: number[]
  pendingAction: { type: "expand" | "collapse"; metricId: number } | null
  selectedMetricId: number | null
  isSltDataLoading: boolean
  handleToggleRow: (metricId: number) => void
}

export const ServiceAlignmentCell: React.FC<ServiceAlignmentCellProps> = ({
  data,
  value,
  expandedMetrics,
  pendingAction,
  selectedMetricId,
  isSltDataLoading,
  handleToggleRow,
}) => {
  if (!data) return null

  const rowData = data as GridRowData
  const isParent = rowData.isParent
  const metricId = rowData.metricId
  const isExpanded = isParent && expandedMetrics.includes(metricId)
  const isLoading =
    isParent &&
    ((pendingAction?.type === "expand" && pendingAction.metricId === metricId) ||
      (isSltDataLoading && selectedMetricId === metricId))

  const content = (
    <div style={{ display: "flex", alignItems: "center" }}>
      {isParent && (
        <span
          style={{ cursor: "pointer", marginRight: "5px" }}
          onClick={(e) => {
            e.stopPropagation()
            handleToggleRow(metricId)
          }}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : isExpanded ? (
            <ChevronDown size={16} data-testid="chevron-down" aria-hidden="true" />
          ) : (
            <ChevronRight size={16} data-testid="chevron-right" aria-hidden="true" />
          )}
        </span>
      )}
      {isParent ? value : <div style={{ paddingLeft: "24px" }}>{rowData.sltName}</div>}
    </div>
  )

  return (
    <MetricTooltip
      metricName={isParent ? (rowData.metricName ?? "") : (rowData.sltName ?? "")}
      metricDescription={isParent ? (rowData.metricDescription ?? "") : ""}
      metricCalculation={isParent ? (rowData.metricCalculation ?? "") : ""}
      isLoading={false}
    >
      {content}
    </MetricTooltip>
  )
}
