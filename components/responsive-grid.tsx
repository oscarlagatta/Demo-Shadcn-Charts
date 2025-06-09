"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

// Font size configuration
interface FontSizeConfig {
  desktop: {
    header: string
    cell: string
    small: string
  }
  mobile: {
    header: string
    cell: string
    small: string
  }
  scalingFactor?: number // Alternative to specific sizes
}

const defaultFontConfig: FontSizeConfig = {
  desktop: {
    header: "14px",
    cell: "14px",
    small: "12px",
  },
  mobile: {
    header: "12px",
    cell: "12px",
    small: "10px",
  },
  scalingFactor: 0.85, // Mobile font size = desktop * scalingFactor
}

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

// Hook for dynamic font sizing
const useDynamicFontSizing = (isMobile: boolean, fontConfig: FontSizeConfig = defaultFontConfig) => {
  const [currentFontSizes, setCurrentFontSizes] = useState(fontConfig.desktop)

  useEffect(() => {
    if (isMobile) {
      if (fontConfig.scalingFactor && !fontConfig.mobile) {
        // Use scaling factor approach
        const scaledSizes = {
          header: `${Number.parseInt(fontConfig.desktop.header) * fontConfig.scalingFactor}px`,
          cell: `${Number.parseInt(fontConfig.desktop.cell) * fontConfig.scalingFactor}px`,
          small: `${Number.parseInt(fontConfig.desktop.small) * fontConfig.scalingFactor}px`,
        }
        setCurrentFontSizes(scaledSizes)
      } else {
        // Use specific mobile sizes
        setCurrentFontSizes(fontConfig.mobile)
      }
    } else {
      setCurrentFontSizes(fontConfig.desktop)
    }
  }, [isMobile, fontConfig])

  return currentFontSizes
}

// Sample data
const generateData = (count = 100) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ["Electronics", "Clothing", "Food", "Books"][Math.floor(Math.random() * 4)],
    price: Math.floor(Math.random() * 1000) + 10,
    quantity: Math.floor(Math.random() * 100),
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
    description: `This is a detailed description for item ${i + 1}. It contains additional information.`,
  }))
}

interface ResponsiveGridProps {
  fontConfig?: FontSizeConfig
  customStyles?: {
    headerBackground?: string
    cellBackground?: string
    borderColor?: string
  }
}

export default function ResponsiveGrid({ fontConfig = defaultFontConfig, customStyles = {} }: ResponsiveGridProps) {
  const isMobile = useMobileDetection()
  const fontSizes = useDynamicFontSizing(isMobile, fontConfig)
  const [rowData] = useState(generateData(100))
  const [gridApi, setGridApi] = useState(null)
  const [activeColumns, setActiveColumns] = useState<string[]>(["id", "name", "price"])

  // Dynamic styles based on mobile state and font configuration
  const gridStyles = useMemo(() => {
    const baseStyles = {
      fontSize: fontSizes.cell,
      "--ag-header-height": isMobile ? "36px" : "40px",
      "--ag-row-height": isMobile ? "32px" : "36px",
      "--ag-list-item-height": isMobile ? "28px" : "32px",
    }

    return {
      ...baseStyles,
      "--ag-font-size": fontSizes.cell,
      "--ag-header-font-size": fontSizes.header,
      "--ag-font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      "--ag-header-foreground-color": customStyles.headerBackground || "#333",
      "--ag-background-color": customStyles.cellBackground || "#fff",
      "--ag-border-color": customStyles.borderColor || "#ddd",
    }
  }, [fontSizes, isMobile, customStyles])

  // Define all possible columns with responsive font sizing
  const allColumns = useMemo<ColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: isMobile ? 70 : 90,
        pinned: isMobile ? "left" : undefined,
        cellStyle: {
          fontSize: fontSizes.cell,
          lineHeight: isMobile ? "1.2" : "1.4",
          padding: isMobile ? "4px" : "8px",
        },
        headerClass: "responsive-header",
      },
      {
        field: "name",
        headerName: "Name",
        width: isMobile ? 120 : 150,
        pinned: isMobile ? "left" : undefined,
        cellStyle: {
          fontSize: fontSizes.cell,
          lineHeight: isMobile ? "1.2" : "1.4",
          padding: isMobile ? "4px" : "8px",
          fontWeight: "500",
        },
        headerClass: "responsive-header",
      },
      {
        field: "category",
        headerName: "Category",
        width: 120,
        cellStyle: {
          fontSize: fontSizes.cell,
          lineHeight: isMobile ? "1.2" : "1.4",
          padding: isMobile ? "4px" : "8px",
        },
        headerClass: "responsive-header",
      },
      {
        field: "price",
        headerName: "Price",
        width: 100,
        valueFormatter: (params) => `$${params.value}`,
        cellStyle: {
          fontSize: fontSizes.cell,
          lineHeight: isMobile ? "1.2" : "1.4",
          padding: isMobile ? "4px" : "8px",
          fontWeight: "600",
          color: "#059669",
        },
        headerClass: "responsive-header",
      },
      {
        field: "quantity",
        headerName: "Qty",
        width: isMobile ? 60 : 100,
        cellStyle: {
          fontSize: fontSizes.cell,
          lineHeight: isMobile ? "1.2" : "1.4",
          padding: isMobile ? "4px" : "8px",
          textAlign: "center",
        },
        headerClass: "responsive-header",
      },
      {
        field: "date",
        headerName: "Date",
        width: 110,
        cellStyle: {
          fontSize: fontSizes.small,
          lineHeight: isMobile ? "1.2" : "1.4",
          padding: isMobile ? "4px" : "8px",
          color: "#6b7280",
        },
        headerClass: "responsive-header",
      },
      {
        field: "description",
        headerName: "Description",
        width: 200,
        hide: isMobile, // Always hide on mobile
        cellStyle: {
          fontSize: fontSizes.small,
          lineHeight: isMobile ? "1.2" : "1.4",
          padding: isMobile ? "4px" : "8px",
          color: "#6b7280",
        },
        headerClass: "responsive-header",
        cellRenderer: (params) => {
          const maxLength = isMobile ? 30 : 50
          const text = params.value || ""
          const truncated = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text

          return (
            <div
              style={{
                fontSize: fontSizes.small,
                lineHeight: isMobile ? "1.2" : "1.4",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={text}
            >
              {truncated}
            </div>
          )
        },
      },
    ],
    [isMobile, fontSizes],
  )

  // Filter columns based on active columns
  const columnDefs = useMemo(() => {
    return allColumns.map((col) => ({
      ...col,
      hide: col.hide || (isMobile && !activeColumns.includes(col.field || "")),
    }))
  }, [allColumns, activeColumns, isMobile])

  // Default column definition with responsive font sizing
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: !isMobile, // Disable filters on mobile
      resizable: !isMobile, // Disable resizing on mobile
      suppressMovable: isMobile, // Prevent column moving on mobile
      cellStyle: {
        fontSize: fontSizes.cell,
        lineHeight: isMobile ? "1.2" : "1.4",
        padding: isMobile ? "4px" : "8px",
      },
    }),
    [isMobile, fontSizes],
  )

  // Grid ready handler
  const onGridReady = useCallback((params) => {
    setGridApi(params.api)

    // Auto-size columns on initial load
    setTimeout(() => {
      params.api.sizeColumnsToFit()
    }, 100)
  }, [])

  // Toggle column visibility
  const toggleColumn = (field: string) => {
    setActiveColumns((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  // Export to CSV (mobile-friendly action)
  const exportData = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `data-export-${new Date().toISOString().split("T")[0]}.csv`,
      })
    }
  }

  // Dynamic CSS injection for responsive font sizing
  useEffect(() => {
    const styleId = "responsive-grid-dynamic-styles"
    const existingStyle = document.getElementById(styleId)

    if (existingStyle) {
      existingStyle.remove()
    }

    const style = document.createElement("style")
    style.id = styleId
    style.textContent = `
      .ag-theme-alpine .responsive-header .ag-header-cell-text {
        font-size: ${fontSizes.header} !important;
        font-weight: 600 !important;
        line-height: ${isMobile ? "1.2" : "1.4"} !important;
      }
      
      .ag-theme-alpine .ag-header-cell {
        padding: ${isMobile ? "4px 6px" : "8px 12px"} !important;
        min-height: ${isMobile ? "36px" : "40px"} !important;
      }
      
      .ag-theme-alpine .ag-cell {
        padding: ${isMobile ? "4px 6px" : "8px 12px"} !important;
        line-height: ${isMobile ? "1.2" : "1.4"} !important;
        display: flex !important;
        align-items: center !important;
      }
      
      .ag-theme-alpine .ag-row {
        min-height: ${isMobile ? "32px" : "36px"} !important;
      }
      
      .ag-theme-alpine .ag-header-row {
        min-height: ${isMobile ? "36px" : "40px"} !important;
      }
      
      .ag-theme-alpine .ag-cell-wrapper {
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
      }
      
      /* Mobile-specific adjustments */
      ${
        isMobile
          ? `
        .ag-theme-alpine .ag-header-cell-menu-button {
          display: none !important;
        }
        
        .ag-theme-alpine .ag-header-cell-resize {
          display: none !important;
        }
        
        .ag-theme-alpine .ag-cell-focus {
          border: none !important;
        }
        
        .ag-theme-alpine .ag-row-hover {
          background-color: rgba(0, 0, 0, 0.03) !important;
        }
      `
          : ""
      }
      
      /* Pagination controls font sizing */
      .ag-theme-alpine .ag-paging-panel {
        font-size: ${fontSizes.small} !important;
      }
      
      .ag-theme-alpine .ag-paging-button {
        font-size: ${fontSizes.small} !important;
        padding: ${isMobile ? "4px 8px" : "6px 12px"} !important;
      }
      
      /* Filter and menu font sizing */
      .ag-theme-alpine .ag-menu {
        font-size: ${fontSizes.cell} !important;
      }
      
      .ag-theme-alpine .ag-filter {
        font-size: ${fontSizes.cell} !important;
      }
    `

    document.head.appendChild(style)

    return () => {
      const styleToRemove = document.getElementById(styleId)
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [fontSizes, isMobile])

  return (
    <div className="flex flex-col space-y-4">
      {/* Mobile toolbar with column selector */}
      {isMobile && (
        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
          <h2 className="font-medium text-gray-800" style={{ fontSize: fontSizes.header }}>
            Data Grid
          </h2>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={exportData} style={{ fontSize: fontSizes.small }}>
              Export
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" style={{ fontSize: fontSizes.small }}>
                  <Menu className="h-4 w-4 mr-1" />
                  Columns
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="py-4">
                  <h3 className="font-medium mb-4" style={{ fontSize: fontSizes.header }}>
                    Visible Columns
                  </h3>
                  <div className="space-y-2">
                    {allColumns.map((col) => (
                      <div key={col.field} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`col-${col.field}`}
                          checked={activeColumns.includes(col.field || "")}
                          onChange={() => toggleColumn(col.field || "")}
                          className="mr-2 h-4 w-4"
                          disabled={col.field === "id" || col.field === "name"} // Keep essential columns
                        />
                        <label htmlFor={`col-${col.field}`} style={{ fontSize: fontSizes.cell }}>
                          {col.headerName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* The grid component */}
      <div className={`ag-theme-alpine w-full ${isMobile ? "h-[500px]" : "h-[600px]"}`} style={gridStyles}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowHeight={isMobile ? 32 : 36}
          headerHeight={isMobile ? 36 : 40}
          suppressCellFocus={isMobile}
          suppressRowClickSelection={isMobile}
          suppressRowDrag={true}
          suppressContextMenu={isMobile}
          enableCellTextSelection={true}
          suppressMovableColumns={isMobile}
          suppressColumnMoveAnimation={true}
          suppressAnimationFrame={isMobile}
          pagination={true}
          paginationPageSize={isMobile ? 10 : 20}
          domLayout={isMobile ? "autoHeight" : "normal"}
        />
      </div>

      {/* Mobile pagination info */}
      {isMobile && (
        <div className="text-center text-gray-500 mt-2" style={{ fontSize: fontSizes.small }}>
          Swipe horizontally to view more data
        </div>
      )}
    </div>
  )
}

// Export the font configuration type and default config for external use
export type { FontSizeConfig }
export { defaultFontConfig }
