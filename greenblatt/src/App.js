"use client"

import { useState, useEffect, useCallback } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import axios from "axios"
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import About from "./components/About"
import Dashboard from "./components/SimpleDashboard"
import CompanyManagement from "./components/CompanyManagement"
import Resources from "./components/Resources"
import Contact from "./components/Contact"

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
      setCompanies(response.data)
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message)
      setError(`Error fetching companies: ${err.response?.data?.error || err.message}`)
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
      setError(`Error deleting company: ${err.response?.data?.error || err.message}`)
    }
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
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
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="bg-gray-200 py-4 text-center">
          <p>&copy; 2023 Magic Formula Investing. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App

