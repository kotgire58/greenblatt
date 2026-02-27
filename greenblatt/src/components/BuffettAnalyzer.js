"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { Search, Loader2 } from "lucide-react"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

function BuffettAnalyzer() {
  const [searchParams] = useSearchParams()
  const urlTicker = searchParams.get("ticker") || ""

  const [ticker, setTicker] = useState(urlTicker)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async (tickerSymbol = ticker) => {
    if (!tickerSymbol.trim()) return

    try {
      setLoading(true)
      setError(null)
      setData(null)

      const res = await axios.get(
        `${API_URL}/api/buffett/${tickerSymbol}`
      )

      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 Auto-run if ticker comes from Portfolio page
  useEffect(() => {
    if (urlTicker) {
      analyze(urlTicker)
    }
  }, [urlTicker])

  const scoreColor = (score) => {
    if (score >= 75) return "text-emerald-400"
    if (score >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold">
          Buffett <span className="text-emerald-400">Analyzer</span>
        </h1>
      </div>

      {/* INPUT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Enter ticker (AAPL, MSFT...)"
              value={ticker}
              onChange={(e) =>
                setTicker(e.target.value.toUpperCase())
              }
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-400 text-white"
            />
          </div>

          <button
            onClick={() => analyze()}
            disabled={loading}
            className="px-6 py-4 rounded-xl bg-emerald-400 text-slate-900 font-bold hover:bg-emerald-300 transition flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Analyzing
              </>
            ) : (
              "Run"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* RESULTS */}
      {data && (
        <div className="space-y-10">

          {/* SCORE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-slate-500 text-sm uppercase">
              Overall Score
            </p>

            <div
              className={`text-6xl font-extrabold mt-4 ${scoreColor(
                data.buffettScore
              )}`}
            >
              {data.buffettScore}
              <span className="text-2xl text-slate-500">
                {" "}
                / 100
              </span>
            </div>
          </div>

          {/* BREAKDOWN */}
          {data.breakdown && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Score Breakdown
              </h3>

              {Object.entries(data.breakdown).map(
                ([key, value]) => (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-slate-400 capitalize">
                        {key}
                      </span>
                      <span className="text-white">
                        {value}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full">
                      <div
                        className="h-3 bg-emerald-400 rounded-full"
                        style={{
                          width: `${(value / 35) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* DERIVED METRICS */}
          {data.derived && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Derived Metrics
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-slate-400">
                {Object.entries(data.derived).map(
                  ([key, value]) => (
                    <div key={key}>
                      <span className="capitalize">
                        {key}:{" "}
                      </span>
                      <span className="text-white">
                        {value ?? "N/A"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* LLM ANALYSIS */}
          {data.llmAnalysis && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                AI Assessment
              </h3>
              <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                {data.llmAnalysis}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BuffettAnalyzer