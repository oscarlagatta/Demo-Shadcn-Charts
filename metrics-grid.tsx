"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import { AgGridReact } from "ag-grid-react"
import { ChevronDown, ChevronRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

// Register the required AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule])

// Static data instead of fetching from hooks
const mainMetrics = [
  {
    metricPrefix: "PM001",
    valueType: "%",
    metricId: 1,
    metricName: "PBI Record has Coordinator 24 hours after creation PBI",
    serviceAlignment: "IT Services",
    trigger: 87.42,
    limit: 73.89,
    source: "DataMart.",
    firstMonth: "2025-03",
    secondMonth: "2025-02",
    thirdMonth: "2025-01",
    fourthMonth: "2024-12",
    fiveMonth: "2024-11",
    sixMonth: "2024-10",
    firstMonth_Result: "83.33-125-150",
    secondMonth_Result: "82.35-112-136",
    thirdMonth_Result: "83.33-125-150",
    fourthMonth_Result: "86.67-130-150",
    fiveMonth_Result: "90.91-140-154",
    sixMonth_Result: null,
    firstMonth_Color: "Green",
    secondMonth_Color: "Green",
    thirdMonth_Color: "Green",
    fourthMonth_Color: "Green",
    fiveMonth_Color: "Green",
    sixMonth_Color: "Grey",
    metricColor: "Green",
  },
  {
    metricPrefix: "PM002",
    valueType: "Days",
    metricId: 2,
    metricName: "Incident Resolution within SLA",
    serviceAlignment: null,
    trigger: 85.05,
    limit: 70.93,
    source: "ServiceNow.",
    firstMonth: "2025-03",
    secondMonth: "2025-02",
    thirdMonth: "2025-01",
    fourthMonth: "2024-12",
    fiveMonth: "2024-11",
    sixMonth: "2024-10",
    firstMonth_Result: "86.67-130-150",
    secondMonth_Result: "90.91-140-154",
    thirdMonth_Result: "76.47-104-136",
    fourthMonth_Result: "82.35-112-136",
    fiveMonth_Result: null,
    sixMonth_Result: null,
    firstMonth_Color: "Green",
    secondMonth_Color: "Green",
    thirdMonth_Color: "Amber",
    fourthMonth_Color: "Amber",
    fiveMonth_Color: "Grey",
    sixMonth_Color: "Grey",
    metricColor: "Green",
  },
  {
    metricPrefix: "PM003",
    valueType: "Hours",
    metricId: 3,
    metricName: "Change Request Approval Rate",
    serviceAlignment: "IT Services",
    trigger: 89.01,
    limit: 69.32,
    source: "PowerBI.",
    firstMonth: "2025-03",
    secondMonth: "2025-02",
    thirdMonth: "2025-01",
    fourthMonth: "2024-12",
    fiveMonth: "2024-11",
    sixMonth: "2024-10",
    firstMonth_Result: "93.33-140-150",
    secondMonth_Result: "90.91-140-154",
    thirdMonth_Result: "76.47-104-136",
    fourthMonth_Result: null,
    fiveMonth_Result: null,
    sixMonth_Result: null,
    firstMonth_Color: "Green",
    secondMonth_Color: "Green",
    thirdMonth_Color: "Amber",
    fourthMonth_Color: "Grey",
    fiveMonth_Color: "Grey",
    sixMonth_Color: "Grey",
    metricColor: "Green",
  },
  {
    metricPrefix: "PM004",
    valueType: "Count",
    metricId: 4,
    metricName: "Service Request Completion Time",
    serviceAlignment: null,
    trigger: 76.05,
    limit: 67.93,
    source: "Tableau.",
    firstMonth: "2025-03",
    secondMonth: "2025-02",
    thirdMonth: "2025-01",
    fourthMonth: "2024-12",
    fiveMonth: "2024-11",
    sixMonth: "2024-10",
    firstMonth_Result: "83.33-125-150",
    secondMonth_Result: "86.67-130-150",
    thirdMonth_Result: "90.91-140-154",
    fourthMonth_Result: "76.47-104-136",
    fiveMonth_Result: null,
    sixMonth_Result: null,
    firstMonth_Color: "Green",
    secondMonth_Color: "Green",
    thirdMonth_Color: "Green",
    fourthMonth_Color: "Green",
    fiveMonth_Color: "Grey",
    sixMonth_Color: "Grey",
    metricColor: "Green",
  },
  {
    metricPrefix: "PM005",
    valueType: "Score",
    metricId: 5,
    metricName: "System Availability Percentage",
    serviceAlignment: "IT Services",
    trigger: 85.93,
    limit: 71.01,
    source: "JIRA.",
    firstMonth: "2025-03",
    secondMonth: "2025-02",
    thirdMonth: "2025-01",
    fourthMonth: "2024-12",
    fiveMonth: "2024-11",
    sixMonth: "2024-10",
    firstMonth_Result: "82.35-112-136",
    secondMonth_Result: "83.33-125-150",
    thirdMonth_Result: "93.33-140-150",
    fourthMonth_Result: "86.67-130-150",
    fiveMonth_Result: "90.91-140-154",
    sixMonth_Result: null,
    firstMonth_Color: "Amber",
    secondMonth_Color: "Amber",
    thirdMonth_Color: "Green",
    fourthMonth_Color: "Green",
    fiveMonth_Color: "Green",
    sixMonth_Color: "Grey",
    metricColor: "Amber",
  },
]

// Detail records by metric ID
const detailRecordsByMetricId = {
  "1": [
    {
      metricId: 1,
      sltMBId: 100,
      sltName: "John Wilson",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "82.35-28-34",
      secondMonth_Result: "80.00-28-35",
      thirdMonth_Result: "82.35-28-34",
      fourthMonth_Result: "85.71-30-35",
      fiveMonth_Result: "90.91-40-44",
      sixMonth_Result: null,
      firstMonth_Color: "Amber",
      secondMonth_Color: "Amber",
      thirdMonth_Color: "Amber",
      fourthMonth_Color: "Amber",
      fiveMonth_Color: "Green",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 1,
      sltMBId: 101,
      sltName: "Sarah Brown",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "80.00-40-50",
      secondMonth_Result: "82.35-28-34",
      thirdMonth_Result: "80.00-40-50",
      fourthMonth_Result: "85.71-30-35",
      fiveMonth_Result: "90.91-40-44",
      sixMonth_Result: null,
      firstMonth_Color: "Amber",
      secondMonth_Color: "Amber",
      thirdMonth_Color: "Amber",
      fourthMonth_Color: "Amber",
      fiveMonth_Color: "Green",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 1,
      sltMBId: 102,
      sltName: "William Smith",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "86.36-38-44",
      secondMonth_Result: "84.85-28-33",
      thirdMonth_Result: "86.36-38-44",
      fourthMonth_Result: "88.89-40-45",
      fiveMonth_Result: "90.91-40-44",
      sixMonth_Result: null,
      firstMonth_Color: "Amber",
      secondMonth_Color: "Amber",
      thirdMonth_Color: "Amber",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Green",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 1,
      sltMBId: 103,
      sltName: "Emma Rodriguez",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "86.36-19-22",
      secondMonth_Result: "82.35-28-34",
      thirdMonth_Result: "86.36-19-22",
      fourthMonth_Result: "88.57-31-35",
      fiveMonth_Result: "90.91-20-22",
      sixMonth_Result: null,
      firstMonth_Color: "Amber",
      secondMonth_Color: "Amber",
      thirdMonth_Color: "Amber",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Green",
      sixMonth_Color: "Grey",
    },
  ],
  "2": [
    {
      metricId: 2,
      sltMBId: 110,
      sltName: "Michael Johnson",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "85.71-30-35",
      secondMonth_Result: "90.91-40-44",
      thirdMonth_Result: "76.47-26-34",
      fourthMonth_Result: "82.35-28-34",
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 2,
      sltMBId: 111,
      sltName: "Lisa Davis",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "85.71-30-35",
      secondMonth_Result: "90.91-40-44",
      thirdMonth_Result: "76.47-26-34",
      fourthMonth_Result: "82.35-28-34",
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 2,
      sltMBId: 112,
      sltName: "David Miller",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "88.89-40-45",
      secondMonth_Result: "90.91-40-44",
      thirdMonth_Result: "76.47-26-34",
      fourthMonth_Result: "82.35-28-34",
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 2,
      sltMBId: 113,
      sltName: "Robert Garcia",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "86.36-19-22",
      secondMonth_Result: "90.91-20-22",
      thirdMonth_Result: "76.47-26-34",
      fourthMonth_Result: "82.35-28-34",
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
  ],
  "3": [
    {
      metricId: 3,
      sltMBId: 120,
      sltName: "Jane Williams",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "93.33-42-45",
      secondMonth_Result: "90.91-40-44",
      thirdMonth_Result: "76.47-26-34",
      fourthMonth_Result: null,
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Grey",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 3,
      sltMBId: 121,
      sltName: "Olivia Jones",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "93.33-42-45",
      secondMonth_Result: "90.91-40-44",
      thirdMonth_Result: "76.47-26-34",
      fourthMonth_Result: null,
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Grey",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 3,
      sltMBId: 122,
      sltName: "Sarah Brown",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "93.33-28-30",
      secondMonth_Result: "90.91-30-33",
      thirdMonth_Result: "76.47-26-34",
      fourthMonth_Result: null,
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Grey",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 3,
      sltMBId: 123,
      sltName: "William Smith",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "93.33-28-30",
      secondMonth_Result: "90.91-30-33",
      thirdMonth_Result: "76.47-26-34",
      fourthMonth_Result: null,
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Grey",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
  ],
  "4": [
    {
      metricId: 4,
      sltMBId: 130,
      sltName: "Emma Rodriguez",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "83.33-25-30",
      secondMonth_Result: "86.67-26-30",
      thirdMonth_Result: "90.91-40-44",
      fourthMonth_Result: "76.47-26-34",
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 4,
      sltMBId: 131,
      sltName: "Robert Garcia",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "83.33-25-30",
      secondMonth_Result: "86.67-26-30",
      thirdMonth_Result: "90.91-40-44",
      fourthMonth_Result: "76.47-26-34",
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 4,
      sltMBId: 132,
      sltName: "David Miller",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "83.33-25-30",
      secondMonth_Result: "86.67-26-30",
      thirdMonth_Result: "90.91-30-33",
      fourthMonth_Result: "76.47-26-34",
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 4,
      sltMBId: 133,
      sltName: "Lisa Davis",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "83.33-50-60",
      secondMonth_Result: "86.67-52-60",
      thirdMonth_Result: "90.91-30-33",
      fourthMonth_Result: "76.47-26-34",
      fiveMonth_Result: null,
      sixMonth_Result: null,
      firstMonth_Color: "Green",
      secondMonth_Color: "Green",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Grey",
      sixMonth_Color: "Grey",
    },
  ],
  "5": [
    {
      metricId: 5,
      sltMBId: 140,
      sltName: "John Wilson",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "82.35-28-34",
      secondMonth_Result: "83.33-25-30",
      thirdMonth_Result: "93.33-42-45",
      fourthMonth_Result: "86.67-26-30",
      fiveMonth_Result: "90.91-40-44",
      sixMonth_Result: null,
      firstMonth_Color: "Amber",
      secondMonth_Color: "Amber",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Green",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 5,
      sltMBId: 141,
      sltName: "Michael Johnson",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "82.35-28-34",
      secondMonth_Result: "83.33-25-30",
      thirdMonth_Result: "93.33-42-45",
      fourthMonth_Result: "86.67-26-30",
      fiveMonth_Result: "90.91-40-44",
      sixMonth_Result: null,
      firstMonth_Color: "Amber",
      secondMonth_Color: "Amber",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Green",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 5,
      sltMBId: 142,
      sltName: "Jane Williams",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "82.35-28-34",
      secondMonth_Result: "83.33-25-30",
      thirdMonth_Result: "93.33-28-30",
      fourthMonth_Result: "86.67-52-60",
      fiveMonth_Result: "90.91-30-33",
      sixMonth_Result: null,
      firstMonth_Color: "Amber",
      secondMonth_Color: "Amber",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Green",
      sixMonth_Color: "Grey",
    },
    {
      metricId: 5,
      sltMBId: 143,
      sltName: "Olivia Jones",
      metricColor: null,
      firstMonth: "2025-03",
      secondMonth: "2025-02",
      thirdMonth: "2025-01",
      fourthMonth: "2024-12",
      fiveMonth: "2024-11",
      sixMonth: "2024-10",
      firstMonth_Result: "82.35-28-34",
      secondMonth_Result: "83.33-50-60",
      thirdMonth_Result: "93.33-28-30",
      fourthMonth_Result: "86.67-26-30",
      fiveMonth_Result: "90.91-30-33",
      sixMonth_Result: null,
      firstMonth_Color: "Amber",
      secondMonth_Color: "Amber",
      thirdMonth_Color: "Green",
      fourthMonth_Color: "Green",
      fiveMonth_Color: "Green",
      sixMonth_Color: "Grey",
    },
  ],
}

// Metric descriptions for tooltips
const metricDescriptions = {
  1: {
    metricDescription:
      "Measures the percentage of PBI records that have a coordinator assigned within 24 hours of creation",
    metricCalculation:
      "Number of PBI records with coordinator assigned within 24 hours / Total number of PBI records created",
  },
  2: {
    metricDescription: "Tracks the percentage of incidents resolved within the Service Level Agreement timeframe",
    metricCalculation: "Number of incidents resolved within SLA / Total number of incidents",
  },
  3: {
    metricDescription: "Measures the rate at which change requests are approved by the Change Advisory Board",
    metricCalculation: "Number of approved change requests / Total number of change requests submitted",
  },
  4: {
    metricDescription: "Tracks the time taken to complete service requests from submission to resolution",
    metricCalculation: "Number of service requests completed within target time / Total number of service requests",
  },
  5: {
    metricDescription: "Measures the percentage of time that systems are available and operational",
    metricCalculation: "Uptime duration / Total time period being measured",
  },
}

// Performance color constants
const metricPerformanceColors = {
  parent: {
    good: "#009922",
    vgood: "#ffffff",
    warning: "#EA7600",
    bad: "#94002B",
    null: "#c6c6c6",
  },
  child: {
    good: "#99D3A7",
    vgood: "#FFFFFF",
    warning: "#f7c899",
    bad: "#dfb2bf",
    null: "#d3d3d3",
  },
}

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-6 h-6 animate-spin">
    <div className="w-4 h-4 border-2 border-t-transparent border-gray-600 rounded-full" />
  </div>
)

// Fetching progress component
const FetchingProgress = () => (
  <div className="flex flex-col items-center justify-center">
    <LoadingSpinner />
    <p className="mt-2 text-gray-600">Loading metrics data...</p>
  </div>
)

// Metric tooltip component
const MetricTooltip = ({ metricName, metricDescription, metricCalculation, isLoading, children }) => {
  if (isLoading) {
    return <div>{children}</div>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            {children}
            {metricDescription && <Info size={14} className="ml-1 text-gray-400" />}
          </div>
        </TooltipTrigger>
        {metricDescription && (
          <TooltipContent className="max-w-md p-4">
            <div className="space-y-2">
              <h4 className="font-semibold">{metricName}</h4>
              <p className="text-sm">{metricDescription}</p>
              {metricCalculation && (
                <div>
                  <h5 className="text-sm font-semibold mt-2">Calculation:</h5>
                  <p className="text-sm">{metricCalculation}</p>
                </div>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

// Main metrics grid component
export default function MetricsGrid() {
  const [expandedMetrics, setExpandedMetrics] = useState<number[]>([])
  const [selectedMetricId, setSelectedMetricId] = useState<number | null>(null)
  const [gridData, setGridData] = useState<any[]>([])
  const [hoveredMetricId, setHoveredMetricId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize grid data with main metrics
  useEffect(() => {
    const baseData = mainMetrics.map((metric) => ({
      ...metric,
      isParent: true,
    }))
    setGridData(baseData)
  }, [])

  // Simulate loading SLT data when a metric is selected
  useEffect(() => {
    if (selectedMetricId) {
      setIsLoading(true)

      // Simulate API call with timeout
      const timer = setTimeout(() => {
        const detailRecords = detailRecordsByMetricId[selectedMetricId.toString()]

        if (detailRecords) {
          setGridData((currentData) => {
            const newData = currentData.map((row) => {
              if (row.metricId === selectedMetricId && row.isParent) {
                // Expand the parent Row
                return [
                  row,
                  ...detailRecords.map((slt) => ({
                    ...row,
                    ...slt,
                    metricId: row.metricId,
                    isParent: false,
                    sltName: slt.sltName,
                    sltNBId: slt.sltMBId,
                  })),
                ]
              }
              return row
            })
            return newData.flat()
          })
          setExpandedMetrics((prev) => [...prev, selectedMetricId])
        }

        setIsLoading(false)
      }, 800) // Simulate network delay

      return () => clearTimeout(timer)
    }
  }, [selectedMetricId])

  // Generate month columns based on the first metric
  const monthColumns = useMemo(() => {
    if (!mainMetrics || mainMetrics.length === 0) return []

    const firstMetric = mainMetrics[0]
    return [
      { month: firstMetric.firstMonth, result: "firstMonth_Result" },
      { month: firstMetric.secondMonth, result: "secondMonth_Result" },
      { month: firstMetric.thirdMonth, result: "thirdMonth_Result" },
      { month: firstMetric.fourthMonth, result: "fourthMonth_Result" },
      { month: firstMetric.fiveMonth, result: "fiveMonth_Result" },
      { month: firstMetric.sixMonth, result: "sixMonth_Result" },
    ]
  }, [])

  // Handle row click to expand/collapse
  const handleRowClicked = useCallback(
    (event: any) => {
      if (event.data?.isParent && event.data?.metricId) {
        const metricId = event.data.metricId
        if (expandedMetrics.includes(metricId)) {
          // Collapse
          setExpandedMetrics((prev) => prev.filter((id) => id !== metricId))
          setGridData((currentData) => currentData.filter((row) => row.metricId !== metricId || row.isParent))
        } else {
          // Expand
          setSelectedMetricId(metricId)
        }
      }
    },
    [expandedMetrics],
  )

  // Generate unique row ID
  const getRowId = (params: any) => {
    return params.data.isParent
      ? `metric-${params.data.metricId}`
      : `slt-${params.data.metricId}-${params.data.sltMBId || params.data.sltNBId}`
  }

  // Get cell color based on performance
  const getCellColor = (params: any) => {
    const monthField = params.column.getColId()
    if (!monthField) return "white"

    const colorField = monthField.replace("_Result", "_Color")

    // Use a type assertion to tell TypeScript that params.data has the color fields
    const data = params.data as any
    const isParent = params.data.isParent

    if (colorField in data) {
      const color = data[colorField]

      if (typeof color === "string") {
        switch (color.toLowerCase()) {
          case "red":
            return isParent ? metricPerformanceColors.parent.bad : metricPerformanceColors.child.bad
          case "green":
            return isParent ? metricPerformanceColors.parent.good : metricPerformanceColors.child.good
          case "amber":
            return isParent ? metricPerformanceColors.parent.warning : metricPerformanceColors.child.warning
          case "grey":
          case "black":
            return isParent ? metricPerformanceColors.parent.null : metricPerformanceColors.child.null
          default:
            return "white"
        }
      }
    }

    return "#f0f0f0"
  }

  // Define column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Metric",
        field: "metricName",
        cellRenderer: (params: any) => {
          if (!params.data) return null

          const isParent = params.data.isParent
          const isExpanded = isParent && expandedMetrics.includes(params.data.metricId)
          const isCurrentlyLoading = isParent && isLoading && selectedMetricId === params.data.metricId

          const content = (
            <div
              className="flex items-center"
              onMouseEnter={() => setHoveredMetricId(params.data?.metricId ?? null)}
              onMouseLeave={() => setHoveredMetricId(null)}
            >
              {isParent &&
                (isCurrentlyLoading ? (
                  <LoadingSpinner />
                ) : (
                  <span
                    className="cursor-pointer mr-1.5"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRowClicked({
                        data: params.data,
                      })
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} data-testid="chevron-down" aria-hidden="true" />
                    ) : (
                      <ChevronRight size={16} data-testid="chevron-right" aria-hidden="true" />
                    )}
                  </span>
                ))}
              {isParent ? params.value : <div className="pl-6">{params.data.sltName}</div>}
            </div>
          )

          const metricData = metricDescriptions[params.data.metricId]

          return (
            <MetricTooltip
              metricName={isParent ? (params.data.metricName ?? "") : (params.data.sltName ?? "")}
              metricDescription={metricData?.metricDescription ?? ""}
              metricCalculation={metricData?.metricCalculation ?? ""}
              isLoading={false}
            >
              {content}
            </MetricTooltip>
          )
        },
        flex: 2,
        filter: true,
      },
      {
        headerName: "Metric Id",
        field: "metricPrefix",
        flex: 1,
        filter: true,
        cellRenderer: (params: any) => {
          return params.data?.isParent ? params.value : ""
        },
      },
      {
        headerName: "Trigger",
        field: "trigger",
        flex: 1,
        cellStyle: () => ({
          textAlign: "center",
          color: "green",
        }),
        valueFormatter: (params: any) => {
          if (params.value === null) return "n/a"
          if (!params.data?.isParent) return ""
          return params.data.valueType === "%" ? `${params.value.toFixed(2)}%` : params.value.toFixed(2)
        },
        filter: true,
      },
      {
        headerName: "Limit",
        field: "limit",
        flex: 1,
        cellStyle: { textAlign: "center", color: "red" },
        valueFormatter: (params: any) => {
          if (params.value === null) return "n/a"
          if (!params.data?.isParent) return ""
          return params.data.valueType === "%" ? `${params.value.toFixed(2)}%` : params.value.toFixed(2)
        },
        filter: true,
      },
      {
        headerName: "Source",
        field: "source",
        flex: 1,
        filter: true,
        cellRenderer: (params: any) => {
          return params.data?.isParent ? params.value : ""
        },
      },
      ...monthColumns.map(({ month, result }) => ({
        headerClass: "text-center",
        headerName: typeof month === "string" ? month.toUpperCase() : "N/A",
        field: result,
        flex: 1,
        cellStyle: (params: any) => {
          if (!params.data) return { backgroundColor: "white" }

          const colorField = result.replace("_Result", "_Color")
          const colorValue = params.data[colorField]?.toLowerCase()
          const isParent = params.data.isParent

          let bgColor = "white"
          if (colorValue) {
            switch (colorValue) {
              case "red":
                bgColor = isParent ? metricPerformanceColors.parent.bad : metricPerformanceColors.child.bad
                break
              case "green":
                bgColor = isParent ? metricPerformanceColors.parent.good : metricPerformanceColors.child.good
                break
              case "amber":
                bgColor = isParent ? metricPerformanceColors.parent.warning : metricPerformanceColors.child.warning
                break
              case "grey":
              case "black":
                bgColor = isParent ? metricPerformanceColors.parent.null : metricPerformanceColors.child.null
                break
              default:
                bgColor = "white"
            }
          }

          const isDarkBackground =
            isParent && (colorValue === "red" || colorValue === "amber" || colorValue === "green")

          return {
            textAlign: "center",
            backgroundColor: bgColor,
            color: isDarkBackground ? "#ffffff" : "#333333",
            padding: "8px 4px",
          }
        },
        valueFormatter: (params: any) => {
          if (!params.value) return "NDTR"
          return params.value
        },
        cellRenderer: (params: any) => {
          if (!params.value) return "NDTR"
          if (params.value === "NDTR") return params.value

          const parts = params.value.split("-")

          if (parts.length !== 3) return params.value

          const [percentage, numerator, denominator] = parts
          const isParent = params.data.isParent
          const colorField = result.replace("_Result", "_Color")
          const colorValue = params.data[colorField]?.toLowerCase()
          const isDarkBackground =
            isParent && (colorValue === "red" || colorValue === "amber" || colorValue === "green")

          const formattedPercentage =
            Number.parseFloat(percentage).toFixed(2) + (params.data.valueType === "%" ? "%" : "")
          const formattedFraction = `${numerator}/${denominator}`

          return (
            <div className="flex flex-col items-center justify-center h-full">
              <div
                className="text-sm font-medium"
                style={{
                  color: isDarkBackground ? "#ffffff" : "#595959",
                }}
              >
                {formattedPercentage}
              </div>
              <div
                className="text-xs font-medium"
                style={{
                  color: isDarkBackground ? "rgba(255,255,255,0.8)" : "#7f7f7f",
                }}
              >
                {formattedFraction}
              </div>
            </div>
          )
        },
        filter: true,
      })),
    ],
    [monthColumns, expandedMetrics, isLoading, selectedMetricId, handleRowClicked],
  )

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }

  return (
    <div className="ag-theme-alpine h-[600px] w-full">
      <AgGridReact
        rowData={gridData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        suppressRowTransform={true}
        onRowClicked={handleRowClicked}
        domLayout="autoHeight"
        theme="legacy"
      />
    </div>
  )
}
