"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"
const API_URL = `${BASE_URL}/api/portfolio`

const Portfolio = () => {
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await axios.get(API_URL)
      setHoldings(res.data.holdings || [])
    } catch (err) {
      console.error(err)
      setError("Failed to fetch portfolio")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const handleUpload = async (file, type) => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading(true)
      setError(null)

      await axios.post(`${API_URL}/${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      fetchPortfolio()
    } catch (err) {
      console.error(err)
      setError("Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const deleteHolding = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchPortfolio()
    } catch (err) {
      console.error(err)
      setError("Delete failed")
    }
  }

  return (
    <div className="container mx-auto px-6 py-10 text-white">

      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>

      {/* Upload Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">Upload Portfolio</h2>

        <div className="flex gap-6">
          <label className="cursor-pointer bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Upload CSV
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={(e) =>
                handleUpload(e.target.files[0], "upload-csv")
              }
            />
          </label>

          <label className="cursor-pointer bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700 transition">
            Upload Screenshot
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                handleUpload(e.target.files[0], "upload-image")
              }
            />
          </label>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Ticker</th>
              <th className="p-4">Shares</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((h) => (
              <tr key={h._id} className="border-t border-gray-800">
                <td className="p-4 font-semibold">{h.ticker}</td>
                <td className="p-4">{h.shares}</td>
                <td className="p-4 flex gap-3 justify-center">

                  <button
                    onClick={() => navigate(`/buffett?ticker=${h.ticker}`)}
                    className="bg-emerald-500 px-3 py-1 rounded hover:bg-emerald-600 transition text-slate-900 font-semibold"
                  >
                    Analyze
                  </button>

                  <button
                    onClick={() => deleteHolding(h._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {holdings.length === 0 && !loading && (
          <div className="p-6 text-gray-500">
            No holdings yet. Upload your portfolio.
          </div>
        )}
      </div>

      {loading && (
        <div className="mt-6 text-gray-400">
          Processing...
        </div>
      )}

      {error && (
        <div className="mt-6 text-red-500">
          {error}
        </div>
      )}
    </div>
  )
}

export default Portfolio