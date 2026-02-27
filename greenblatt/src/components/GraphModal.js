"use client"

import { useState, useMemo } from "react"
import { X } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

const GraphModal = ({ isOpen, onClose, companies }) => {
  const [metric, setMetric] = useState("greenBlattsValue")

  const metrics = [
    { value: "greenBlattsValue", label: "Greenblatt Rank" },
    { value: "earningYield", label: "Earnings Yield" },
    { value: "ROC", label: "Return on Capital (ROC)" },
    { value: "EBIT", label: "EBIT" },
  ]

  const selectedMetricLabel =
    metrics.find((m) => m.value === metric)?.label || metric

  // ✅ Hooks must always run
  const data = useMemo(() => {
    return companies
      .map((company) => ({
        name: company.ticker,
        value: company[metric] ?? 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [companies, metric])

  // ✅ Conditional return AFTER hooks
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl p-10 relative shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold">
            Ranking Visualization
          </h2>
          <p className="text-slate-400 mt-2">
            Top 10 companies by {selectedMetricLabel}
          </p>
        </div>

        {/* METRIC SELECTOR */}
        <div className="mb-8">
          <label className="block text-slate-400 text-sm mb-2">
            Select Metric
          </label>

          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="w-64 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-400 text-white transition"
          >
            {metrics.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* CHART */}
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
              />

              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />

              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                cursor={{ fill: "rgba(16,185,129,0.1)" }}
              />

              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default GraphModal