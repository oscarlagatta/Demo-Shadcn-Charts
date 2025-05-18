// Define props interface for the component
export interface MetricsGridProps {
  selectedMonth?: string // Format: "YYYY-MM", undefined means "All Months"
  selectedLeader?: { id: string; name: string } | null // null means "All Leaders"
  metricTypeId?: number
}

// Define the new API response structure
export interface MonthData {
  month: string
  numerator: string
  denominator: string
  result: string
  color: string
  updatedDateTime: string | null
}

export interface MetricData {
  metricId: number
  metricPrefix: string
  metricName: string
  valueType: string
  metricDescription: string
  metricCalculation: string
  serviceAlignment: string
  trigger: number
  limit: number
  source: string
  metricType: string
  thresholdDirection: string | null
  monthlyData: MonthData[]
}

// Define SLT data structure
export interface SltMonthData {
  month: string
  numerator: string
  denominator: string
  result: string
  color: string
}

export interface SltData {
  sltNbkId: string
  sltName: string
  sltMonthlyData: SltMonthData[]
}

export interface SltResponse {
  metricId: number
  sltData: SltData[]
}

// Define the grid row data structure
export interface GridRowData {
  metricId: number
  metricPrefix?: string
  metricName?: string
  valueType?: string
  metricDescription?: string
  metricCalculation?: string
  serviceAlignment?: string
  trigger?: number
  limit?: number
  source?: string
  metricType?: string
  isParent: boolean
  sltName?: string
  sltNBId?: string
  // Dynamic month fields will be added at runtime
  [key: string]: any
}

export interface CellColorParams {
  data: GridRowData
  column: {
    getColId: () => string
  }
}

export interface MonthColumn {
  month: string
  result: string
}

export interface PendingAction {
  type: "expand" | "collapse"
  metricId: number
}
