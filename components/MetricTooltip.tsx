"use client"

import type React from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface MetricTooltipProps {
  metricName: string
  metricDescription?: string
  metricCalculation?: string
  isLoading: boolean
  children: React.ReactNode
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({
  metricName,
  metricDescription,
  metricCalculation,
  isLoading,
  children,
}) => {
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
