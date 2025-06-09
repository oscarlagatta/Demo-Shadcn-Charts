"use client"

import ResponsiveGrid, { type FontSizeConfig } from "./responsive-grid"

// Example of custom font configurations
const largeFontConfig: FontSizeConfig = {
  desktop: {
    header: "16px",
    cell: "15px",
    small: "13px",
  },
  mobile: {
    header: "14px",
    cell: "13px",
    small: "11px",
  },
}

const compactFontConfig: FontSizeConfig = {
  desktop: {
    header: "13px",
    cell: "12px",
    small: "10px",
  },
  mobile: {
    header: "11px",
    cell: "10px",
    small: "9px",
  },
}

const scalingFactorConfig: FontSizeConfig = {
  desktop: {
    header: "14px",
    cell: "14px",
    small: "12px",
  },
  mobile: {
    header: "12px", // This will be ignored when scalingFactor is used
    cell: "12px", // This will be ignored when scalingFactor is used
    small: "10px", // This will be ignored when scalingFactor is used
  },
  scalingFactor: 0.8, // Mobile font size = desktop * 0.8
}

export default function ResponsiveGridExample() {
  return (
    <div className="space-y-8 p-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Default Font Configuration</h2>
        <ResponsiveGrid />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Large Font Configuration</h2>
        <ResponsiveGrid
          fontConfig={largeFontConfig}
          customStyles={{
            headerBackground: "#f3f4f6",
            cellBackground: "#ffffff",
            borderColor: "#e5e7eb",
          }}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Compact Font Configuration</h2>
        <ResponsiveGrid fontConfig={compactFontConfig} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Scaling Factor Configuration</h2>
        <ResponsiveGrid fontConfig={scalingFactorConfig} />
      </div>
    </div>
  )
}
