"use client"

import { useCallback, useEffect, useState, useMemo, useRef } from "react"
import type { ColDef, GetRowIdParams, ICellRendererParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { ChevronDown, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MetricTooltip } from "./MetricTooltip"
import { type CellColorParams, useDashboardData } from "@/utils/data-services"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

// Custom hook for mobile detection
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Loading spinner component
const LoadingSpinner = () => (
  <div className="relative h-5 w-5">
    <div className="absolute inset-0 animate-spin rounded-full border-2 border-b-amber-500 border-l-red-500 border-r-green-500 border-t-transparent"></div>
    <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white">
      <div className="h-1 w-1 rounded-full bg-gray-700"></div>
    </div>
  </div>
)

const renderLoadingSpinner = () => {
  return (
    <div className="h-[600px] w-full flex flex-col items-center justify-center">
      <LoadingSpinner />
      <p className="mt-4 text-gray-600 font-medium">Loading metrics data...</p>
    </div>
  )
}

// Define props interface for the component
interface MetricsGridProps {
  selectedMonth?: string
  selectedLeader?: { id: string; name: string } | null
  metricTypeId?: number
}

const MetricsGrid = ({ selectedMonth, selectedLeader, metricTypeId }: MetricsGridProps) => {
  const isMobile = useMobileDetection()
  const gridApiRef = useRef<any>(null)
  const [expandedMetrics, setExpandedMetrics] = useState<number[]>([])
  const [selectedMetricId, setSelectedMetricId] = useState<number | null>(null)
  const [gridData, setGridData] = useState<any[]>([])
  const [pendingAction, setPendingAction] = useState<{
    type: "expand" | "collapse"
    metricId: number
  } | null>(null)
  const [activeColumns, setActiveColumns] = useState<string[]>(["serviceAlignment", "metricName", "firstMonth_Result"])

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

  const [isLoading, setIsLoading] = useState(true)
  const [isGridMounted, setIsGridMounted] = useState(false)
  const [allUniqueMonths, setAllUniqueMonths] = useState<string[]>([])

  // Update loading state
  useEffect(() => {
    setIsLoading(sixMonthByMetricPerformanceQuery.isLoading)
  }, [sixMonthByMetricPerformanceQuery.isLoading])

  // Collect all unique months across all metrics
  useEffect(() => {
    if (sixMonthByMetricPerformance && sixMonthByMetricPerformance.length > 0) {
      const uniqueMonths = new Set<string>()

      // Loop through all metrics to collect all available months
      sixMonthByMetricPerformance.forEach((metric: any) => {
        metric.monthlyData.forEach((monthData: any) => {
          uniqueMonths.add(monthData.month)
        })
      })

      // Convert to array and sort (newest first)
      const sortedMonths = Array.from(uniqueMonths).sort(
        (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime(),
      )

      // Limit to only the 6 most recent months
      const last6Months = sortedMonths.slice(0, 6)
      setAllUniqueMonths(last6Months)
    }
  }, [sixMonthByMetricPerformance])

  // Initialize grid data with sixMonthByMetricPerformance
  useEffect(() => {
    if (sixMonthByMetricPerformance && allUniqueMonths.length > 0) {
      const baseData = sixMonthByMetricPerformance.map((metric: any) => {
        // Create a base row with metric data
        const baseRow: any = {
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
        metric.monthlyData.forEach((monthData: any) => {
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

  // Helper function to get month name by index
  const getMonthNameByIndex = (index: number): string | null => {
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
    ]
    return index <= monthNames.length ? monthNames[index - 1] : null
  }

  // Get available months for display
  const monthColumns = useMemo(() => {
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

    // For mobile, limit to fewer months
    const monthLimit = isMobile ? 3 : 6

    // Return only the most recent months
    return allUniqueMonths.slice(0, monthLimit).map((month: string, index: number) => {
      const monthName = getMonthNameByIndex(index + 1)
      return {
        month,
        result: `${monthName}Month_Result`,
      }
    })
  }, [allUniqueMonths, selectedMonth, isMobile])

  const handleToggleRow = useCallback(
    (metricId: number) => {
      // If there's already a pending action, ignore this click
      if (pendingAction !== null) return

      if (expandedMetrics.includes(metricId)) {
        // Collapse: Set a pending collapse action
        setPendingAction({ type: "collapse", metricId })
      } else {
        // Expand: set the selected metric ID and a pending expand action
        setSelectedMetricId(metricId)
        setPendingAction({ type: "expand", metricId })
      }
    },
    [expandedMetrics, pendingAction],
  )

  const getRowId = (params: GetRowIdParams) => {
    return params.data.isParent
      ? `metric-${params.data.metricId}`
      : `slt-${params.data.metricId}-${params.data.sltNBId}`
  }

  const getCellColor = (params: CellColorParams) => {
    const monthField = params.column.getColId()
    if (!monthField) return { backgroundColor: "#f8f9fa" }

    const colorField = monthField.replace("_Result", "_Color")
    const data = params.data
    const isParent = data.isParent

    if (colorField in data) {
      const color = data[colorField]

      if (typeof color === "string") {
        switch (color.toLowerCase()) {
          case "#e61622":
          case "red":
            return {
              background: isParent
                ? "linear-gradient(135deg, #94002B 0%, #B8002F 50%, #94002B 100%)"
                : "linear-gradient(135deg, #dfb2bf 0%, #e8c5ce 50%, #dfb2bf 100%)",
            }
          case "#009223":
          case "green":
            return {
              background: isParent
                ? "linear-gradient(135deg, #009922 0%, #00B526 50%, #009922 100%)"
                : "linear-gradient(135deg, #99D3A7 0%, #B3E0BE 50%, #99D3A7 100%)",
            }
          case "#ffbf00":
          case "amber":
            return {
              background: isParent
                ? "linear-gradient(135deg, #EA7600 0%, #FF8A00 50%, #EA7600 100%)"
                : "linear-gradient(135deg, #f7c899 0%, #fad4a8 50%, #f7c899 100%)",
            }
          case "grey":
          case "black":
            return {
              background: isParent
                ? "linear-gradient(135deg, #c6c6c6 0%, #d4d4d4 50%, #c6c6c6 100%)"
                : "linear-gradient(135deg, #d3d3d3 0%, #e0e0e0 50%, #d3d3d3 100%)",
            }
          default:
            return { backgroundColor: "#f8f9fa" }
        }
      }
    }

    return { backgroundColor: "#f0f0f0" }
  }

  // Define all possible columns
  const allColumns = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Service Alignment",
        field: "serviceAlignment",
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.data) return null

          const data = params.data
          const isParent = data.isParent
          const metricId = data.metricId
          const isExpanded = isParent && expandedMetrics.includes(metricId)
          const isLoading = isParent && isSltDataLoading && selectedMetricId === metricId

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
              {isParent ? params.value : <div style={{ paddingLeft: "24px" }}>{data.sltName}</div>}
            </div>
          )

          return (
            <MetricTooltip
              metricName={isParent ? (data.metricName ?? "") : (data.sltName ?? "")}
              metricDescription={isParent ? (data.metricDescription ?? "") : ""}
              metricCalculation={isParent ? (data.metricCalculation ?? "") : ""}
              isLoading={false}
            >
              {content}
            </MetricTooltip>
          )
        },
        flex: 2,
        minWidth: isMobile ? 150 : 200,
        pinned: "left",
        headerClass: "custom-header",
      },
      {
        headerName: "Metric",
        field: "metricName",
        flex: 1,
        minWidth: isMobile ? 120 : 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.data?.isParent ? "[" + params.data.metricPrefix + "] " + params.value : ""
        },
        headerClass: "custom-header",
      },
      {
        headerName: "Type",
        field: "metricType",
        flex: 1,
        minWidth: 100,
        hide: isMobile, // Hide on mobile by default
        headerClass: "custom-header",
      },
      {
        headerName: "Thresholds",
        field: "trigger",
        flex: 1,
        minWidth: 120,
        hide: isMobile, // Hide on mobile by default
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.data?.isParent) return ""

          const trigger = params.data.trigger
          const limit = params.data.limit
          const valueType = params.data.valueType
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
        },
        headerClass: "custom-header",
      },
      {
        headerName: "Source",
        field: "source",
        flex: 1,
        minWidth: 100,
        hide: isMobile, // Hide on mobile by default
        headerClass: "custom-header",
      },
      ...monthColumns.map(({ month, result }) => ({
        headerClass: "custom-header text-center",
        headerName: month
          ? new Date(month).toLocaleDateString("en-US", {
              year: "2-digit",
              month: "short",
            })
          : "N/A",
        field: result,
        flex: 1,
        minWidth: isMobile ? 80 : 100,
        cellStyle: (params: any) => {
          const backgroundStyle = getCellColor(params)
          return {
            textAlign: "center",
            ...backgroundStyle,
            border: "1px solid #000000",
          }
        },
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.value) return "NDTR"
          if (params.value === "NDTR") return params.value

          const parts = params.value.split("-")
          if (parts.length !== 3) return params.value

          const [percentage, numerator, denominator] = parts
          const isParent = params.data.isParent
          const colorField = params.column.getColId().replace("_Result", "_Color")
          const cellColor = params.data[colorField]

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

          // For mobile, show simplified display
          if (isMobile) {
            return (
              <div className="text-sm font-medium" style={{ color: isLightBg ? "#000000" : "#ffffff" }}>
                {Number.parseFloat(percentage).toFixed(1) + (params.data.valueType === "%" ? "%" : "")}
              </div>
            )
          }

          // For desktop, show detailed display
          const formattedPercentage =
            Number.parseFloat(percentage).toFixed(2) + (params.data.valueType === "%" ? "%" : "")
          const formattedFraction = `${numerator}/${denominator}`

          return (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="text-sm font-medium" style={{ color: isLightBg ? "#000000" : "#ffffff" }}>
                {formattedPercentage}
              </div>
              <div className="text-xs font-medium" style={{ color: isLightBg ? "#000000" : "#d9d9d9" }}>
                {formattedFraction}
              </div>
            </div>
          )
        },
        headerClass: "custom-header",
      })),
    ],
    [monthColumns, expandedMetrics, isSltDataLoading, selectedMetricId, handleToggleRow, isMobile],
  )

  // Filter columns based on active columns for mobile
  const columnDefs = useMemo(() => {
    if (!isMobile) return allColumns

    return allColumns.map((col) => ({
      ...col,
      hide: col.hide || !activeColumns.includes(col.field || ""),
    }))
  }, [allColumns, activeColumns, isMobile])

  // Updated defaultColDef to optimize for mobile
  const defaultColDef: ColDef = {
    sortable: true,
    filter: !isMobile, // Disable filtering on mobile
    resizable: !isMobile, // Disable resizing on mobile
    suppressMovable: isMobile, // Prevent column moving on mobile
  }

  useEffect(() => {
    setIsGridMounted(true)
  }, [])

  // Add CSS for better horizontal scrolling and grid styling
  useEffect(() => {
    if (!isGridMounted) return

    // Create a style element for grid styles
    const styleElement = document.createElement("style")
    styleElement.id = "grid-horizontal-scroll-styles"
    styleElement.textContent = `
    .ag-root-wrapper {
      width: 100% !important;
      overflow-x: auto;
    }
    .ag-center-cols-container {
      width: 100% !important;
      min-width: max-content;
    }
    .ag-header-container, .ag-center-cols-container, .ag-body-viewport {
      width: 100% !important;
    }
    .ag-body-viewport {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }
    .ag-header-cell {
      border: 1px solid #000000 !important;
    }
    .ag-row {
      border-color: #000000 !important;
    }
    .custom-header {
      background-color: #012169 !important;
      color: #FFFFFF !important;
    }
    .custom-header .ag-header-cell-text {
      color: #FFFFFF !important;
      ${isMobile ? "font-size: 12px !important;" : ""}
    }
    .ag-header-cell-label {
      color: #FFFFFF !important;
    }
    
    /* Hide filter icons in header */
    .ag-header-cell-menu-button {
      display: none !important;
    }
    
    /* Mobile optimizations */
    ${
      isMobile
        ? `
      .ag-header-cell {
        padding: 0 4px !important;
      }
      .ag-cell {
        padding: 0 4px !important;
      }
      .ag-cell-value {
        font-size: 12px !important;
      }
      .ag-row {
        height: 40px !important;
      }
      .ag-header-cell {
        height: 40px !important;
      }
    `
        : ""
    }
  `
    document.head.appendChild(styleElement)

    // Clean up on component unmount
    return () => {
      const existingStyle = document.getElementById("grid-horizontal-scroll-styles")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [isGridMounted, isMobile])

  const onGridReady = useCallback((params: any) => {
    gridApiRef.current = params.api

    // Auto-size columns on initial load
    setTimeout(() => {
      params.api.sizeColumnsToFit()
    }, 100)
  }, [])

  // Toggle column visibility
  const toggleColumn = (field: string) => {
    setActiveColumns((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  if (isLoading) {
    return renderLoadingSpinner()
  }

  return (
    <div className="space-y-4">
      {/* Mobile toolbar with column selector */}
      {isMobile && (
        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
          <h2 className="text-sm font-medium">Metrics Grid</h2>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline">
                <Menu className="h-4 w-4 mr-1" />
                Columns
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="py-4">
                <h3 className="text-lg font-medium mb-4">Visible Columns</h3>
                <div className="space-y-2">
                  {allColumns.map((col) => {
                    // Skip month columns except the first one for simplicity
                    if (col.field?.includes("Month_Result") && col.field !== "firstMonth_Result") {
                      return null
                    }

                    return (
                      <div key={col.field} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`col-${col.field}`}
                          checked={activeColumns.includes(col.field || "")}
                          onChange={() => toggleColumn(col.field || "")}
                          className="mr-2 h-4 w-4"
                          disabled={col.field === "serviceAlignment"} // Keep essential column
                        />
                        <label htmlFor={`col-${col.field}`} className="text-sm">
                          {col.headerName}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <div className="ag-theme-alpine w-full h-full relative">
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
            suppressMenuHide={true}
            loading={isLoading}
            rowHeight={isMobile ? 40 : 48}
            headerHeight={isMobile ? 40 : 48}
            suppressCellFocus={isMobile}
            suppressMovableColumns={isMobile}
            pagination={isMobile}
            paginationPageSize={isMobile ? 10 : 20}
          />
        </div>
      </div>

      {/* Mobile pagination info */}
      {isMobile && (
        <div className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
            <polyline points="9 18 3 12 9 6"></polyline>
          </svg>
          Swipe horizontally to view all columns
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
            <polyline points="15 18 21 12 15 6"></polyline>
          </svg>
        </div>
      )}
    </div>
  )
}

export default MetricsGrid
