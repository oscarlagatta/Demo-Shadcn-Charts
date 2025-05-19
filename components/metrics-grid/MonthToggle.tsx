"use client"

import type React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface MonthToggleProps {
  showExtendedMonths: boolean
  onToggle: (value: boolean) => void
}

export const MonthToggle: React.FC<MonthToggleProps> = ({ showExtendedMonths, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch id="month-toggle" checked={showExtendedMonths} onCheckedChange={onToggle} />
      <Label htmlFor="month-toggle" className="text-sm font-medium">
        {showExtendedMonths ? "Showing 13 months" : "Showing 6 months"}
      </Label>
    </div>
  )
}
