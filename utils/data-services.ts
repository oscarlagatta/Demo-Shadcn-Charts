"use client"

import { useState, useEffect } from "react"
import { mainMetrics, detailRecordsByMetricId, metricDescriptions } from "@/data/metrics-data"

// Mock implementation of useDashboardData
export const useDashboardData = (selectedMonth?: string, selectedLeaderId?: string, metricTypeId?: number) => {
  // Filter metrics based on the provided filters
  const filteredMetrics = mainMetrics.map((metric) => {
    // Convert the metric to the expected API format
    return {
      metricId: metric.metricId,
      metricPrefix: metric.metricPrefix,
      metricName: metric.metricName,
      valueType: metric.valueType,
      metricDescription: metricDescriptions[metric.metricId]?.metricDescription || "",
      metricCalculation: metricDescriptions[metric.metricId]?.metricCalculation || "",
      serviceAlignment: metric.serviceAlignment,
      trigger: metric.trigger,
      limit: metric.limit,
      source: metric.source,
      metricType: "Performance", // Default value
      thresholdDirection: null,
      monthlyData: [
        {
          month: metric.firstMonth,
          numerator: metric.firstMonth_Result ? metric.firstMonth_Result.split("-")[1] : "0",
          denominator: metric.firstMonth_Result ? metric.firstMonth_Result.split("-")[2] : "0",
          result: metric.firstMonth_Result || "NDTR",
          color: metric.firstMonth_Color || "grey",
          updatedDateTime: null,
        },
        {
          month: metric.secondMonth,
          numerator: metric.secondMonth_Result ? metric.secondMonth_Result.split("-")[1] : "0",
          denominator: metric.secondMonth_Result ? metric.secondMonth_Result.split("-")[2] : "0",
          result: metric.secondMonth_Result || "NDTR",
          color: metric.secondMonth_Color || "grey",
          updatedDateTime: null,
        },
        {
          month: metric.thirdMonth,
          numerator: metric.thirdMonth_Result ? metric.thirdMonth_Result.split("-")[1] : "0",
          denominator: metric.thirdMonth_Result ? metric.thirdMonth_Result.split("-")[2] : "0",
          result: metric.thirdMonth_Result || "NDTR",
          color: metric.thirdMonth_Color || "grey",
          updatedDateTime: null,
        },
        {
          month: metric.fourthMonth,
          numerator: metric.fourthMonth_Result ? metric.fourthMonth_Result.split("-")[1] : "0",
          denominator: metric.fourthMonth_Result ? metric.fourthMonth_Result.split("-")[2] : "0",
          result: metric.fourthMonth_Result || "NDTR",
          color: metric.fourthMonth_Color || "grey",
          updatedDateTime: null,
        },
        {
          month: metric.fiveMonth,
          numerator: metric.fiveMonth_Result ? metric.fiveMonth_Result.split("-")[1] : "0",
          denominator: metric.fiveMonth_Result ? metric.fiveMonth_Result.split("-")[2] : "0",
          result: metric.fiveMonth_Result || "NDTR",
          color: metric.fiveMonth_Color || "grey",
          updatedDateTime: null,
        },
        {
          month: metric.sixMonth,
          numerator: metric.sixMonth_Result ? metric.sixMonth_Result.split("-")[1] : "0",
          denominator: metric.sixMonth_Result ? metric.sixMonth_Result.split("-")[2] : "0",
          result: metric.sixMonth_Result || "NDTR",
          color: metric.sixMonth_Color || "grey",
          updatedDateTime: null,
        },
      ],
    }
  })

  // Mock query state
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Mock SLT data fetching hook
  const useGetSltMetricPerformance = (metricId: number, month?: string, leaderId?: string) => {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      if (metricId) {
        setIsLoading(true)

        // Simulate API call
        const timer = setTimeout(() => {
          const sltData = detailRecordsByMetricId[metricId.toString()]

          if (sltData) {
            // Convert to expected format
            const formattedData = {
              metricId,
              sltData: sltData.map((slt) => ({
                sltNbkId: slt.sltMBId.toString(),
                sltName: slt.sltName,
                sltMonthlyData: [
                  {
                    month: slt.firstMonth,
                    numerator: slt.firstMonth_Result ? slt.firstMonth_Result.split("-")[1] : "0",
                    denominator: slt.firstMonth_Result ? slt.firstMonth_Result.split("-")[2] : "0",
                    result: slt.firstMonth_Result || "NDTR",
                    color: slt.firstMonth_Color || "grey",
                  },
                  {
                    month: slt.secondMonth,
                    numerator: slt.secondMonth_Result ? slt.secondMonth_Result.split("-")[1] : "0",
                    denominator: slt.secondMonth_Result ? slt.secondMonth_Result.split("-")[2] : "0",
                    result: slt.secondMonth_Result || "NDTR",
                    color: slt.secondMonth_Color || "grey",
                  },
                  {
                    month: slt.thirdMonth,
                    numerator: slt.thirdMonth_Result ? slt.thirdMonth_Result.split("-")[1] : "0",
                    denominator: slt.thirdMonth_Result ? slt.thirdMonth_Result.split("-")[2] : "0",
                    result: slt.thirdMonth_Result || "NDTR",
                    color: slt.thirdMonth_Color || "grey",
                  },
                  {
                    month: slt.fourthMonth,
                    numerator: slt.fourthMonth_Result ? slt.fourthMonth_Result.split("-")[1] : "0",
                    denominator: slt.fourthMonth_Result ? slt.fourthMonth_Result.split("-")[2] : "0",
                    result: slt.fourthMonth_Result || "NDTR",
                    color: slt.fourthMonth_Color || "grey",
                  },
                  {
                    month: slt.fiveMonth,
                    numerator: slt.fiveMonth_Result ? slt.fiveMonth_Result.split("-")[1] : "0",
                    denominator: slt.fiveMonth_Result ? slt.fiveMonth_Result.split("-")[2] : "0",
                    result: slt.fiveMonth_Result || "NDTR",
                    color: slt.fiveMonth_Color || "grey",
                  },
                  {
                    month: slt.sixMonth,
                    numerator: slt.sixMonth_Result ? slt.sixMonth_Result.split("-")[1] : "0",
                    denominator: slt.sixMonth_Result ? slt.sixMonth_Result.split("-")[2] : "0",
                    result: slt.sixMonth_Result || "NDTR",
                    color: slt.sixMonth_Color || "grey",
                  },
                ],
              })),
            }

            setData(formattedData)
          }

          setIsLoading(false)
        }, 800)

        return () => clearTimeout(timer)
      }
    }, [metricId, month, leaderId])

    return { data, isLoading }
  }

  return {
    sixMonthByMetricPerformance: filteredMetrics,
    useGetSltMetricPerformance,
    sixMonthByMetricPerformanceQuery: {
      isLoading,
    },
  }
}

// Export the CellColorParams type
export interface CellColorParams {
  data: any
  column: {
    getColId: () => string
  }
}
