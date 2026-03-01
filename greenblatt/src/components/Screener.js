"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Loader2, Brain, PlusCircle } from "lucide-react"

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"
const API_URL = `${BASE_URL}/api/screener`
const PORTFOLIO_API = `${BASE_URL}/api/portfolio`

const Screener = () => {
  const [query, setQuery] = useState("")
  const [data, setData] = useState(null)
  const [llmInsight, setLlmInsight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [llmLoading, setLlmLoading] = useState(false)
  const [error, setError] = useState(null)

  const [portfolios, setPortfolios] = useState([])
  const [selectedPortfolio, setSelectedPortfolio] = useState("")

  // Fetch user portfolios
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await axios.get(PORTFOLIO_API)
        setPortfolios(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPortfolios()
  }, [])

  const searchTicker = async () => {
    if (!query.trim()) return

    try {
      setLoading(true)
      setError(null)
      setData(null)
      setLlmInsight(null)

      const res = await axios.get(`${API_URL}/${query}`)
      setData(res.data.metrics)
      setLlmInsight(res.data.llmAnalysis)

    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data.")
    } finally {
      setLoading(false)
    }
  }

  const generateLLMInsight = async () => {
    if (!query) return
    try {
      setLlmLoading(true)
      const res = await axios.get(`${API_URL}/${query}`)
      setLlmInsight(res.data.llmAnalysis)
    } catch (err) {
      console.error(err)
    } finally {
      setLlmLoading(false)
    }
  }

  const addToPortfolio = async () => {
    if (!selectedPortfolio || !query) return

    try {
      await axios.post(`${PORTFOLIO_API}/${selectedPortfolio}/add`, {
        ticker: query.toUpperCase(),
        shares: 1
      })
      alert("Added to portfolio.")
    } catch (err) {
      console.error(err)
      alert("Failed to add.")
    }
  }

  const formatPercent = (val) =>
    val ? `${(val * 100).toFixed(2)}%` : "N/A"

  return (
    <div className="container mx-auto px-6 py-10 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Global Screener
      </h1>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && searchTicker()}
            placeholder="Search ticker (e.g., AAPL)"
            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <Search className="absolute right-4 top-4 text-slate-400" />
        </div>

        <button
          onClick={searchTicker}
          className="bg-emerald-400 text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-emerald-300 transition"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="animate-spin" />
          Fetching financial data...
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-6">
          {error}
        </div>
      )}

      {/* SNAPSHOT GRID */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <MetricCard title="Earnings Yield" value={formatPercent(data.earningYield)} />
          <MetricCard title="Return on Capital" value={formatPercent(data.ROC)} />
          <MetricCard title="Enterprise Value" value={data.enterpriseValue?.toLocaleString() || "N/A"} />
          <MetricCard title="Market Cap" value={data.marketCap?.toLocaleString() || "N/A"} />
          <MetricCard title="Debt" value={data.debt?.toLocaleString() || "N/A"} />
          <MetricCard title="Cash" value={data.cash?.toLocaleString() || "N/A"} />

        </div>
      )}

      {/* AI INSIGHT */}
      {data && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-12">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Brain className="text-emerald-400" />
              AI Investment Insight
            </h2>

            <button
              onClick={generateLLMInsight}
              className="text-sm bg-slate-800 px-4 py-2 rounded hover:bg-slate-700 transition"
            >
              Regenerate
            </button>
          </div>

          {llmLoading && (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="animate-spin" />
              Generating AI insight...
            </div>
          )}

          {llmInsight && (
            <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">
              {llmInsight}
            </pre>
          )}

        </div>
      )}

      {/* ADD TO PORTFOLIO */}
      {data && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="text-emerald-400" />
            Add To Portfolio
          </h2>

          <div className="flex gap-4">
            <select
              className="bg-slate-800 p-3 rounded"
              value={selectedPortfolio}
              onChange={(e) => setSelectedPortfolio(e.target.value)}
            >
              <option value="">Select Portfolio</option>
              {portfolios.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={addToPortfolio}
              className="bg-emerald-400 text-slate-900 px-4 py-3 rounded font-bold hover:bg-emerald-300 transition"
            >
              Add
            </button>
          </div>

        </div>
      )}

    </div>
  )
}

const MetricCard = ({ title, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-400/40 transition">
    <div className="text-slate-500 text-sm uppercase tracking-wide">
      {title}
    </div>
    <div className="mt-2 text-xl font-bold text-emerald-400">
      {value}
    </div>
  </div>
)

export default Screener