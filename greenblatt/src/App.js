import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import AddCompany from "./components/AddCompany"
import CompaniesTable from "./components/CompaniesTable"

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
      console.error("Error details:", err.response ? err.response.data : err.message)
      setError(`Error fetching companies: ${err.response ? err.response.data.error : err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/companies/${id}`)
      await refreshCompanies()
    } catch (err) {
      console.error("Error deleting company:", err)
      setError(`Error deleting company: ${err.response ? err.response.data.error : err.message}`)
    }
  }

  useEffect(() => {
    refreshCompanies()
  }, [refreshCompanies])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Management</h1>

      <AddCompany refreshCompanies={refreshCompanies} />

      <hr className="my-8" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <span className="text-2xl">&times;</span>
          </button>
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
}

export default App

