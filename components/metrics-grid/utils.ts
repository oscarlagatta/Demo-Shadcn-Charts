import type { CellColorParams, GridRowData } from "./types"

// Helper function to get month name by index
export const getMonthNameByIndex = (index: number): string | null => {
  const monthNames = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "seventeenth",
    "eighteenth",
    "nineteenth",
    "twentieth",
    "twentyFirst",
    "twentySecond",
    "twentyThird",
    "twentyFourth",
  ]
  return index <= monthNames.length ? monthNames[index - 1] : null
}

// Helper function to get month index from month string
export const getMonthIndex = (monthStr: string, allUniqueMonths: string[]): string | null => {
  if (!allUniqueMonths || allUniqueMonths.length === 0) {
    return null
  }

  // Find the index of the month in the sorted array
  const index = allUniqueMonths.findIndex((m: string) => m === monthStr)
  if (index === -1) return null

  // Convert to 1-based index and get month name
  return getMonthNameByIndex(index + 1)
}

// Function to determine if a background color is light
export const isLightColor = (color: string): boolean => {
  return color === "#f8f9fa" || color === "#f0f0f0"
}

// Get cell color based on performance
export const getCellColor = (params: CellColorParams, metricPerformanceColors: any) => {
  const monthField = params.column.getColId()
  if (!monthField) return "#f8f9fa" // Light gray instead of white

  const colorField = monthField.replace("_Result", "_Color")

  // Use our new GridRowData interface
  const data = params.data as GridRowData

  const isParent = data.isParent

  if (colorField in data) {
    const color = data[colorField]

    if (typeof color === "string") {
      switch (color.toLowerCase()) {
        case "#e61622":
        case "red":
          return isParent ? metricPerformanceColors.parent.bad : metricPerformanceColors.child.bad
        case "#009223":
        case "green":
          return isParent ? metricPerformanceColors.parent.good : metricPerformanceColors.child.good
        case "#ffbf00":
        case "amber":
          return isParent ? metricPerformanceColors.parent.warning : metricPerformanceColors.child.warning
        case "grey":
        case "black":
          return isParent ? metricPerformanceColors.parent.null : metricPerformanceColors.child.null
        default:
          return "#f8f9fa" // Light gray instead of white
      }
    }
  }

  return "#f0f0f0" // Slightly darker gray for default
}
