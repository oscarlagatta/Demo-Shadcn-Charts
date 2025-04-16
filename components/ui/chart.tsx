"use client"
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showXGrid?: boolean
  showYGrid?: boolean
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 40,
  showLegend = true,
  showXGrid = true,
  showYGrid = true,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
        <XAxis dataKey={index} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
          tickMargin={10}
        />
        {showXGrid && <XAxis type="category" hide />}
        {showYGrid && <YAxis type="number" hide />}
        <Tooltip
          cursor={{ fill: "var(--chart-tooltip-bg)", opacity: 0.1 }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{payload[0].name}</span>
                      <span className="text-xs text-muted-foreground">{payload[0].payload[index]}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{valueFormatter(Number(payload[0].value))}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        {showLegend && (
          <Legend
            verticalAlign="top"
            height={40}
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div className="flex justify-center gap-4">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
        )}
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

interface LineChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  showXGrid?: boolean
  showYGrid?: boolean
}

export function LineChart({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 40,
  showLegend = true,
  showXGrid = true,
  showYGrid = true,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
        <XAxis dataKey={index} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis
          width={yAxisWidth}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
          tickMargin={10}
        />
        {showXGrid && <XAxis type="category" hide />}
        {showYGrid && <YAxis type="number" hide />}
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="mt-2 grid gap-1">
                    {payload.map((entry, i) => (
                      <div key={`item-${i}`} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.name}:</span>
                        <span className="text-xs font-medium">{valueFormatter(Number(entry.value))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        {showLegend && (
          <Legend
            verticalAlign="top"
            height={40}
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div className="flex flex-wrap justify-center gap-4">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
        )}
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

interface PieChartProps {
  data: any[]
  index: string
  category: string
  colors: string[]
  valueFormatter?: (value: number) => string
  showAnimation?: boolean
  showLegend?: boolean
  showTooltip?: boolean
}

export function PieChart({
  data,
  index,
  category,
  colors,
  valueFormatter = (value: number) => value.toString(),
  showAnimation = true,
  showLegend = true,
  showTooltip = true,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        {showTooltip && (
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{data[index]}</span>
                      <span className="text-xs text-muted-foreground">{valueFormatter(Number(data[category]))}</span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        )}
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={40}
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div className="flex flex-wrap justify-center gap-4">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
        )}
        <Pie
          data={data}
          dataKey={category}
          nameKey={index}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
          isAnimationActive={showAnimation}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length] || entry.color || colors[0]} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
