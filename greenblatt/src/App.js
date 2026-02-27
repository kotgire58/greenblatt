"use client"

import { useState, useEffect, useCallback } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import axios from "axios"

import Header from "./components/Header"
import HomePage from "./components/HomePage"
import About from "./components/About"
import CompanyManagement from "./components/CompanyManagement"
import Resources from "./components/Resources"
import Contact from "./components/Contact"
import BuffettAnalyzer from "./components/BuffettAnalyzer"
import Portfolio from "./components/Portfolio"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

function App() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshCompanies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(`${API_URL}/api/companies`)

      // In case backend returns { companies: [...] }
      const data = response.data.companies || response.data

      setCompanies(data)
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message)

      setError(
        `Error fetching companies: ${
          err.response?.data?.error || err.message
        }`
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCompanies()
  }, [refreshCompanies])

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/companies/${id}`)
      refreshCompanies()
    } catch (err) {
      console.error("Error deleting company:", err)

      setError(
        `Error deleting company: ${
          err.response?.data?.error || err.message
        }`
      )
    }
  }

  return (
    <Router>
      {/* 🌌 Global Dark Quant Theme */}
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 flex flex-col">

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow relative">

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,_#ffffff_1px,_transparent_0)] bg-[size:20px_20px]" />

          <div className="relative z-10">
            <Routes>

              <Route path="/" element={<HomePage />} />

              <Route
                path="/app"
                element={
                  <CompanyManagement
                    companies={companies}
                    loading={loading}
                    error={error}
                    refreshCompanies={refreshCompanies}
                    deleteCompany={deleteCompany}
                  />
                }
              />

              <Route path="/buffett" element={<BuffettAnalyzer />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/contact" element={<Contact />} />

            </Routes>
          </div>
        </main>

        {/* Premium Footer */}
        <footer className="bg-slate-950 border-t border-slate-800 py-8">
          <div className="container mx-auto px-4 text-center">

            <div className="text-lg font-bold tracking-tight">
              Quant<span className="text-emerald-400">Edge</span>
            </div>

            <p className="text-slate-400 text-sm mt-2">
              Systematic Value Investing Platform
            </p>

            <p className="text-slate-500 text-xs mt-4">
              © 2025 Kamal Kotgire · Built with React, Node.js, Quant Metrics
            </p>

          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App