import type React from "react"
import type { ICellRendererParams } from "ag-grid-community"
import type { GridRowData } from "../types"

export const ThresholdsCell: React.FC<ICellRendererParams> = ({ data, value }) => {
  const rowData = data as GridRowData

  if (!rowData.isParent) return null

  const trigger = rowData.trigger
  const limit = rowData.limit
  const valueType = rowData.valueType
  const suffix = valueType === "%" ? "%" : ""

  const formatValue = (value: number | undefined) => {
    if (value === null || value === undefined) return "n/a"
    return `${value.toFixed(2)}${suffix}`
  }

  return (
    <div className="flex items-center justify-center space-x-1">
      <span className="text-green-600 font-medium">{formatValue(trigger)}</span>
      <span className="text-gray-500">/</span>
      <span className="text-red-600 font-medium">{formatValue(limit)}</span>
    </div>
  )
}
