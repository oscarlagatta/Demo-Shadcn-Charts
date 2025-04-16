"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

import MetricsGrid from "@/components/metrics-grid"
import { mainMetrics } from "@/data/metrics-data"

export default function Dashboard() {
  // Calculate summary metrics
  const totalMetrics = mainMetrics.length
  const greenMetrics = mainMetrics.filter((m) => m.firstMonth_Color === "Green").length
  const amberMetrics = mainMetrics.filter((m) => m.firstMonth_Color === "Amber").length
  const redMetrics = mainMetrics.filter((m) => m.firstMonth_Color === "Red").length
  const performanceRate = ((greenMetrics / totalMetrics) * 100).toFixed(1)

  // Prepare data for trend chart - flatten the data for easier charting
  const trendChartData = (() => {
    // Get all months from the first metric
    const months = [
      mainMetrics[0].firstMonth,
      mainMetrics[0].secondMonth,
      mainMetrics[0].thirdMonth,
      mainMetrics[0].fourthMonth,
      mainMetrics[0].fiveMonth,
      mainMetrics[0].sixMonth,
    ]

    // Create a data point for each month
    return months.map((month, i) => {
      const dataPoint = { month }

      // Add each metric's value for this month
      mainMetrics.forEach((metric) => {
        const resultField = [
          "firstMonth_Result",
          "secondMonth_Result",
          "thirdMonth_Result",
          "fourthMonth_Result",
          "fiveMonth_Result",
          "sixMonth_Result",
        ][i]

        if (metric[resultField]) {
          dataPoint[metric.metricPrefix] = Number.parseFloat(metric[resultField].split("-")[0])
        }
      })

      return dataPoint
    })
  })()

  // Prepare data for comparison chart
  const comparisonData = mainMetrics.map((metric) => ({
    name: metric.metricPrefix,
    value: metric.firstMonth_Result ? Number.parseFloat(metric.firstMonth_Result.split("-")[0]) : 0,
  }))

  // Prepare data for distribution chart
  const distributionData = [
    { name: "Green", value: greenMetrics, color: "#009922" },
    { name: "Amber", value: amberMetrics, color: "#EA7600" },
    { name: "Red", value: redMetrics, color: "#94002B" },
  ].filter((item) => item.value > 0)

  // Calculate month-over-month change
  const getMonthOverMonthChange = () => {
    let currentSum = 0
    let previousSum = 0
    let count = 0

    mainMetrics.forEach((metric) => {
      if (metric.firstMonth_Result && metric.secondMonth_Result) {
        const current = Number.parseFloat(metric.firstMonth_Result.split("-")[0])
        const previous = Number.parseFloat(metric.secondMonth_Result.split("-")[0])
        currentSum += current
        previousSum += previous
        count++
      }
    })

    if (count === 0) return { change: 0, isPositive: true }

    const currentAvg = currentSum / count
    const previousAvg = previousSum / count
    const change = ((currentAvg - previousAvg) / previousAvg) * 100

    return {
      change: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
    }
  }

  const momChange = getMonthOverMonthChange()

  // Get metric prefixes for the line chart
  const metricPrefixes = mainMetrics.map((metric) => metric.metricPrefix)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overall Performance</CardDescription>
            <CardTitle className="text-2xl">{performanceRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground flex items-center">
              <span
                className={momChange.isPositive ? "text-green-600" : "text-red-600"}
                style={{ display: "flex", alignItems: "center" }}
              >
                {momChange.isPositive ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {momChange.change}%
              </span>
              <span className="ml-1">vs previous month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Green Metrics</CardDescription>
            <CardTitle className="text-2xl">{greenMetrics}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {((greenMetrics / totalMetrics) * 100).toFixed(1)}% of total metrics
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Amber Metrics</CardDescription>
            <CardTitle className="text-2xl">{amberMetrics}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {((amberMetrics / totalMetrics) * 100).toFixed(1)}% of total metrics
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Red Metrics</CardDescription>
            <CardTitle className="text-2xl">{redMetrics}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {((redMetrics / totalMetrics) * 100).toFixed(1)}% of total metrics
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Metrics Performance Trends</CardTitle>
            <CardDescription>Performance percentage over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <TrendChart data={trendChartData} metrics={metricPrefixes} />
          </CardContent>
        </Card>

        {/* Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Current Month Metrics Comparison</CardTitle>
            <CardDescription>Performance percentage for the current month across all metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <BarChart
              data={comparisonData}
              index="name"
              categories={["value"]}
              colors={["#2563eb"]} // blue-600
              valueFormatter={(value) => `${value.toFixed(2)}%`}
              yAxisWidth={60}
              showLegend={false}
              showXGrid={false}
              showYGrid={true}
            />
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Metrics Status Distribution</CardTitle>
            <CardDescription>Distribution of metrics by status (Green, Amber, Red)</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <div className="w-full h-full max-w-[400px] mx-auto">
              <PieChart
                data={distributionData}
                index="name"
                category="value"
                colors={distributionData.map((d) => d.color)}
                valueFormatter={(value) => `${value} metrics`}
                showAnimation={true}
                showLegend={true}
                showTooltip={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Metrics Data Grid</CardTitle>
          <CardDescription>Detailed metrics data with expandable rows for detailed records</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-2">
          <MetricsGrid />
        </CardContent>
      </Card>
    </div>
  )
}

// Custom trend chart component specifically for our data format
function TrendChart({ data, metrics }) {
  const colors = [
    "#2563eb", // blue-600
    "#16a34a", // green-600
    "#ea580c", // orange-600
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
  ]

  return (
    <div className="w-full h-full">
      <ResponsiveLineChart
        data={data}
        metrics={metrics}
        colors={colors}
        valueFormatter={(value) => `${value.toFixed(2)}%`}
      />
    </div>
  )
}

// Responsive line chart component
function ResponsiveLineChart({ data, metrics, colors, valueFormatter }) {
  return (
    <div className="w-full h-full">
      <LineChart
        data={data}
        index="month"
        categories={metrics}
        colors={colors}
        valueFormatter={valueFormatter}
        yAxisWidth={60}
        showLegend={true}
        showXGrid={true}
        showYGrid={true}
      />
    </div>
  )
}
