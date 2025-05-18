"use client"

import { useEffect } from "react"

export const useGridStyles = (isGridMounted: boolean) => {
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
    }
    .ag-header-cell-label {
      color: #FFFFFF !important;
    }
    .custom-header .ag-header-icon {
      color: #FFFFFF !important;
      fill: #FFFFFF !important;
    }

    .custom-header .ag-icon {
      color: #FFFFFF !important;
      fill: #FFFFFF !important;
    }

    .ag-header-cell-menu-button .ag-icon-menu {
      color: #FFFFFF !important;
      fill: #FFFFFF !important;
    }

    .ag-header-cell-menu-button:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    .ag-header-cell-menu-button {
      opacity: 0.8;
    }

    .ag-header-cell-menu-button:hover {
      opacity: 1;
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
  }, [isGridMounted])
}
