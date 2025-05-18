import type React from "react"
import type { ICellRendererParams } from "ag-grid-community"
import type { GridRowData } from "../types"

export const MetricCell: React.FC<ICellRendererParams> = ({ data, value }) => {
  const rowData = data as GridRowData
  return rowData.isParent ? "[" + rowData.metricPrefix + "] " + rowData.metricName : ""
}
