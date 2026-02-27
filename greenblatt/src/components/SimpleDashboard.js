"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { TrendingUp, TrendingDown } from "lucide-react"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

function SimpleDashboard() {
  const [portfolio, setPortfolio] = useState(null)
  const [ticker, setTicker] = useState("")
  const [shares, setShares] = useState("")
  const [costBasis, setCostBasis] = useState("")
  const [error, setError] = useState(null)

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/portfolio`)
      setPortfolio(res.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const addHolding = async () => {
    if (!ticker || !shares || !costBasis) return

    try {
      await axios.post(`${API_URL}/api/portfolio`, {
        ticker: ticker.toUpperCase(),
        shares: Number(shares),
        costBasis: Number(costBasis),
      })

      setTicker("")
      setShares("")
      setCostBasis("")
      fetchPortfolio()
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  const deleteHolding = async (id) => {
    await axios.delete(`${API_URL}/api/portfolio/${id}`)
    fetchPortfolio()
  }

  if (!portfolio)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  return (
    <div className="container mx-auto px-6 py-16">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold">
          Portfolio <span className="text-emerald-400">Analytics</span>
        </h1>
        <p className="text-slate-400 mt-3">
          Track position value, factor exposure, and performance.
        </p>
      </div>

      {/* ADD POSITION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-12">
        <h2 className="text-xl font-bold mb-6">
          Add Position
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            className="flex-1 px-4 py-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-400 text-white"
            placeholder="Ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          <input
            className="flex-1 px-4 py-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-400 text-white"
            placeholder="Shares"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
          />
          <input
            className="flex-1 px-4 py-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-400 text-white"
            placeholder="Cost Basis"
            value={costBasis}
            onChange={(e) => setCostBasis(e.target.value)}
          />
          <button
            onClick={addHolding}
            className="px-6 py-4 rounded-xl bg-emerald-400 text-slate-900 font-bold hover:bg-emerald-300 transition"
          >
            Add
          </button>
        </div>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <StatCard
          label="Total Portfolio Value"
          value={`$${portfolio.summary.totalPortfolioValue?.toFixed(2)}`}
        />
        <StatCard
          label="Weighted Earnings Yield"
          value={`${(portfolio.summary.weightedEY * 100)?.toFixed(2)}%`}
        />
        <StatCard
          label="Weighted ROC"
          value={`${(portfolio.summary.weightedROC * 100)?.toFixed(2)}%`}
        />
      </div>

      {/* HOLDINGS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold">
            Holdings
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">Ticker</th>
                <th className="px-6 py-4 text-right">Shares</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Value</th>
                <th className="px-6 py-4 text-right">Gain / Loss</th>
                <th className="px-6 py-4 text-right">EY</th>
                <th className="px-6 py-4 text-right">ROC</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {portfolio.holdings.map((h) => {
                const isPositive = h.gainLoss >= 0

                return (
                  <tr
                    key={h._id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    <td className="px-6 py-4 font-semibold text-white">
                      {h.ticker}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {h.shares}
                    </td>

                    <td className="px-6 py-4 text-right">
                      ${h.currentPrice?.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      ${h.positionValue?.toFixed(2)}
                    </td>

                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        isPositive
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      <span className="flex items-center justify-end gap-1">
                        {isPositive ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        ${h.gainLoss?.toFixed(2)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-emerald-400">
                      {(h.earningYield * 100)?.toFixed(2)}%
                    </td>

                    <td className="px-6 py-4 text-right text-cyan-400">
                      {(h.ROC * 100)?.toFixed(2)}%
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="text-red-400 hover:text-red-300 transition text-xs"
                        onClick={() => deleteHolding(h._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

/* ===== STAT CARD ===== */

const StatCard = ({ label, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-400/30 transition">
    <p className="text-slate-500 text-sm uppercase tracking-wide">
      {label}
    </p>
    <p className="mt-4 text-3xl font-bold text-white">
      {value}
    </p>
  </div>
)

export default SimpleDashboard