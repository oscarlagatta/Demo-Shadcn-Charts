"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import type { Metric } from "@/types"

interface UseColumnDefsProps {
  expandedMetrics: string[]
  onExpand: (metricId: string) => void
  pendingAction: { type: "expand" | "collapse"; metricId: string } | null
  isSltDataLoading: boolean
}

export const useColumnDefs = ({
  expandedMetrics,
  onExpand,
  pendingAction,
  isSltDataLoading,
}: UseColumnDefsProps): ColumnDef<Metric>[] => {
  const columnDefs = useMemo<ColumnDef<Metric>[]>(
    () => [
      {
        id: "metricName",
        header: "Metric",
        cell: ({ row }) => {
          const { data } = row
          const handleExpand = () => {
            onExpand(data.metricId)
          }

          const chevronIcon = expandedMetrics.includes(data.metricId) ? "chevron-up" : "chevron-down"

          return (
            <div className="flex items-center">
              <button onClick={handleExpand} className="mr-2">
                <i className={`lucide lucide-${chevronIcon} h-4 w-4 transition-transform duration-200`} />
              </button>
              {data.metricName}
            </div>
          )
        },
      },
      {
        id: "currentValue",
        header: "Current Value",
        accessorKey: "currentValue",
      },
      {
        id: "targetValue",
        header: "Target Value",
        accessorKey: "targetValue",
      },
    ],
    [expandedMetrics, onExpand, pendingAction, isSltDataLoading],
  )

  return columnDefs
}
