"use client"

import { useState } from "react"
import axios from "axios"
import { Search, Loader2 } from "lucide-react"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

function AddCompany({ refreshCompanies }) {
  const [symbol, setSymbol] = useState("")
  const [market, setMarket] = useState("US")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!symbol.trim()) {
      setError("Please enter a valid stock ticker.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formattedSymbol =
        market === "IN"
          ? `${symbol.toUpperCase()}.NS`
          : symbol.toUpperCase()

      await axios.get(`${API_URL}/api/companies/${formattedSymbol}`)

      setSymbol("")
      refreshCompanies()
    } catch (err) {
      console.error(err)
      setError("Unable to fetch company data. Check the ticker.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

      <h2 className="text-xl font-bold mb-6">
        Add Company to Screener
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-stretch"
      >

        {/* INPUT FIELD */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter ticker (AAPL, MSFT, TCS...)"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-400 text-white placeholder-slate-500 transition"
          />
        </div>

        {/* MARKET SELECT */}
        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="px-4 py-4 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-400 text-white transition"
        >
          <option value="US">🇺🇸 US Market</option>
          <option value="IN">🇮🇳 NSE (India)</option>
        </select>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-400 text-slate-900 font-bold hover:bg-emerald-300 disabled:opacity-60 transition"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Fetching
            </>
          ) : (
            "Add Company"
          )}
        </button>
      </form>

      {/* ERROR */}
      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

export default AddCompany