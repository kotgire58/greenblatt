"use client"

import { useState } from "react"
import { XCircle } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

const GraphModal = ({ isOpen, onClose, companies }) => {
  const [metric, setMetric] = useState("greenBlattsValue")

  if (!isOpen) return null

  const data = companies
    .map((company) => ({
      name: company.name,
      value: company[metric],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  const metrics = [
    { value: "greenBlattsValue", label: "Greenblatt's Value" },
    { value: "earningYield", label: "Earning Yield" },
    { value: "ROC", label: "Return on Capital (ROC)" },
    { value: "EBIT", label: "EBIT" },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Company Metrics Graph</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="metric-select" className="block mb-2">
            Select Metric:
          </label>
          <select
            id="metric-select"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {metrics.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name={metrics.find((m) => m.value === metric).label} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default GraphModal

