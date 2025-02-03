import { useState, useEffect, useCallback } from "react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"
import axios from "axios"
import AddCompany from "./components/AddCompany"
import CompaniesTable from "./components/CompaniesTable"
import HomePage from "./components/HomePage"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

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

  const CompanyManagement = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Company Management</h1>
        <Link
          to="/"
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
        >
          Back to Home
        </Link>
      </div>

      <AddCompany refreshCompanies={refreshCompanies} />

      <hr className="my-8" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <CompaniesTable companies={companies} deleteCompany={deleteCompany} />
      )}
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<CompanyManagement />} />
      </Routes>
    </Router>
  )
}

export default App

