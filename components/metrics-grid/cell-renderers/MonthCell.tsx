import type React from "react"
import type { ICellRendererParams } from "ag-grid-community"
import type { GridRowData } from "../types"

export const MonthCell: React.FC<ICellRendererParams> = ({ data, value, column }) => {
  if (!value) return <span>NDTR</span>
  if (value === "NDTR") return <span>NDTR</span>

  const parts = value.split("-")

  if (parts.length !== 3) return <span>{value}</span>

  const rowData = data as GridRowData
  const [percentage, numerator, denominator] = parts
  const isParent = rowData.isParent

  // Get the cell color to determine text color
  const colorField = column.getColId().replace("_Result", "_Color")
  const cellColor = rowData[colorField]

  // Determine if this is a light background cell
  let isLightBg = true
  if (typeof cellColor === "string") {
    const color = cellColor.toLowerCase()
    isLightBg =
      color !== "#e61622" &&
      color !== "red" &&
      color !== "#009223" &&
      color !== "green" &&
      color !== "#ffbf00" &&
      color !== "amber"
  }

  const formattedPercentage = Number.parseFloat(percentage).toFixed(2) + (rowData.valueType === "%" ? "%" : "")
  const formattedFraction = `${numerator}/${denominator}`

  return (
    <div className="flex h-full flex-col items-center justify-center month-cell-content">
      <div
        className="text-sm font-medium sm:text-xs"
        style={{
          color: isLightBg ? "#000000" : "#ffffff", // Black text for light backgrounds, white for dark
        }}
      >
        {formattedPercentage}
      </div>
      <div
        className="text-xs font-medium sm:text-[10px]"
        style={{
          color: isLightBg ? "#000000" : "#d9d9d9", // Black text for light backgrounds, light gray for dark
        }}
      >
        {formattedFraction}
      </div>
    </div>
  )
}
