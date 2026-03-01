"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"
const API_URL = `${BASE_URL}/api/portfolio`

const GreenblattPortfolio = () => {
  const [portfolios, setPortfolios] = useState([])
  const [selected, setSelected] = useState(null)
  const [ranking, setRanking] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPortfolios = async () => {
      const res = await axios.get(API_URL)
      setPortfolios(res.data)
    }

    fetchPortfolios()
  }, [])

  const runGreenblatt = async () => {
    if (!selected) return

    setLoading(true)

    const res = await axios.get(
      `${API_URL}/${selected}/greenblatt`
    )

    setRanking(res.data)
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-6 py-10 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Greenblatt Portfolio Ranking
      </h1>

      {/* Portfolio Selector */}
      <div className="mb-6">
        <select
          className="bg-slate-800 p-3 rounded"
          onChange={(e) => setSelected(e.target.value)}
        >
          <option>Select Portfolio</option>
          {portfolios.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          onClick={runGreenblatt}
          className="ml-4 bg-emerald-400 text-slate-900 px-4 py-2 rounded font-bold"
        >
          Run Ranking
        </button>
      </div>

      {loading && <p>Calculating...</p>}

      {ranking && (
        <div className="mt-8">

          <h2 className="text-2xl font-semibold mb-4">
            Ranked Holdings
          </h2>

          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-3">Ticker</th>
                <th className="p-3">Earnings Yield</th>
                <th className="p-3">ROC</th>
                <th className="p-3">Combined Rank</th>
              </tr>
            </thead>

            <tbody>
              {ranking.rankedHoldings.map((h) => (
                <tr key={h.ticker} className="border-t border-slate-800">
                  <td className="p-3 font-semibold">{h.ticker}</td>
                  <td className="p-3">
                    {(h.earningYield * 100).toFixed(2)}%
                  </td>
                  <td className="p-3">
                    {(h.ROC * 100).toFixed(2)}%
                  </td>
                  <td className="p-3 font-bold">
                    {h.combinedRank}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </div>
  )
}

export default GreenblattPortfolio