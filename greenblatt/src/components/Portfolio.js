"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"
const API_URL = `${BASE_URL}/api/portfolio`

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([])
  const [selected, setSelected] = useState(null)
  const [holdings, setHoldings] = useState([])
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  // ================= FETCH USER PORTFOLIOS =================

  const fetchPortfolios = async () => {
    try {
      const res = await axios.get(API_URL)
      setPortfolios(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch portfolios")
    }
  }

  // ================= LOAD SINGLE PORTFOLIO =================

  const loadPortfolio = async (id) => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/${id}`)
      setSelected(res.data.portfolio)
      setHoldings(res.data.holdings)
    } catch (err) {
      console.error(err)
      setError("Failed to load portfolio")
    } finally {
      setLoading(false)
    }
  }

  // ================= CREATE PORTFOLIO =================

  const createPortfolio = async () => {
    if (!newName.trim()) return

    try {
      await axios.post(API_URL, { name: newName })
      setNewName("")
      fetchPortfolios()
    } catch (err) {
      console.error(err)
      setError("Failed to create portfolio")
    }
  }

  // ================= UPLOAD =================

  const handleUpload = async (file, type) => {
    if (!file || !selected) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading(true)

      await axios.post(
        `${API_URL}/${selected._id}/${type}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      loadPortfolio(selected._id)
    } catch (err) {
      console.error(err)
      setError("Upload failed")
    } finally {
      setLoading(false)
    }
  }

  // ================= DELETE HOLDING =================

  const deleteHolding = async (holdingId) => {
    try {
      await axios.delete(
        `${API_URL}/${selected._id}/${holdingId}`
      )
      loadPortfolio(selected._id)
    } catch (err) {
      console.error(err)
      setError("Delete failed")
    }
  }

  useEffect(() => {
    fetchPortfolios()
  }, [])

  return (
    <div className="container mx-auto px-6 py-10 text-white">

      <h1 className="text-4xl font-bold mb-8">Portfolios</h1>

      {/* CREATE PORTFOLIO */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">Create Portfolio</h2>

        <div className="flex gap-4">
          <input
            className="bg-gray-800 p-2 rounded w-64"
            placeholder="Portfolio Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={createPortfolio}
            className="bg-emerald-500 px-4 py-2 rounded text-black font-semibold"
          >
            Create
          </button>
        </div>
      </div>

      {/* PORTFOLIO LIST */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Portfolios</h2>

        {portfolios.map((p) => (
          <div
            key={p._id}
            onClick={() => loadPortfolio(p._id)}
            className="bg-gray-800 p-4 rounded mb-3 cursor-pointer hover:bg-gray-700 transition"
          >
            {p.name}
          </div>
        ))}

        {portfolios.length === 0 && (
          <div className="text-gray-500">No portfolios yet.</div>
        )}
      </div>

      {/* SELECTED PORTFOLIO */}
      {selected && (
        <div>

          <h2 className="text-2xl font-bold mb-6">
            {selected.name}
          </h2>

          {/* Upload Section */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-10">
            <h3 className="text-lg font-semibold mb-4">Upload Holdings</h3>

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
                        onClick={() =>
                          navigate(`/buffett?ticker=${h.ticker}`)
                        }
                        className="bg-emerald-500 px-3 py-1 rounded text-black font-semibold"
                      >
                        Analyze
                      </button>

                      <button
                        onClick={() => deleteHolding(h._id)}
                        className="bg-red-600 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {holdings.length === 0 && (
              <div className="p-6 text-gray-500">
                No holdings yet.
              </div>
            )}
          </div>

        </div>
      )}

      {loading && <div className="mt-6 text-gray-400">Processing...</div>}
      {error && <div className="mt-6 text-red-500">{error}</div>}

    </div>
  )
}

export default Portfolio