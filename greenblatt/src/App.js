"use client"

import { useState, useEffect, useCallback } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import axios from "axios"
import Header from "./components/Header"
import AddCompany from "./components/AddCompany"
import CompaniesTable from "./components/CompaniesTable"
import HomePage from "./components/HomePage"
import GraphModal from "./components/GraphModal"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

function App() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false)

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
        <button
          onClick={() => setIsGraphModalOpen(true)}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
        >
          View Graph
        </button>
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
      <GraphModal isOpen={isGraphModalOpen} onClose={() => setIsGraphModalOpen(false)} companies={companies} />
    </div>
  )

  const About = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Magic Formula Investing</h1>
      <p className="mb-4">
        Magic Formula Investing is a strategy developed by Joel Greenblatt, a successful value investor and professor at
        Columbia University. The strategy aims to identify high-quality companies trading at attractive valuations.
      </p>
      <p className="mb-4">The formula ranks companies based on two key metrics:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Return on Capital (ROC): Measures how efficiently a company generates profits from its assets</li>
        <li>Earnings Yield: Indicates how inexpensive a stock is relative to its earnings</li>
      </ul>
      <p>
        By combining these metrics, the Magic Formula seeks to find companies that are both profitable and undervalued,
        potentially leading to better investment outcomes.
      </p>
    </div>
  )

  const Resources = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Video</h2>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/4-IOUObnf5o"
            title="Joel Greenblatt's Magic Formula Investing"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
      <ul className="list-disc list-inside space-y-3">
        <li>
          <a
            href="https://www.magicformulainvesting.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Official Magic Formula Investing Website
          </a>
        </li>
        <li>
          <a
            href="https://www.amazon.com/Little-Book-Still-Beats-Market/dp/0470624159"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            The Little Book That Still Beats the Market by Joel Greenblatt
          </a>
        </li>
        <li>
          <a
            href="https://www.investopedia.com/terms/m/magic-formula-investing.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Investopedia: Magic Formula Investing
          </a>
        </li>
      </ul>
    </div>
  )

  const Contact = () => (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">
        If you have any questions or feedback about our Magic Formula Investing tool, please don't hesitate to reach out
        to us.
      </p>
      <p className="mb-2">
        <strong>Email:</strong> support@magicformulainvesting.com
      </p>
      <p className="mb-2">
        <strong>Phone:</strong> (555) 123-4567
      </p>
      <p>
        <strong>Address:</strong> 123 Investing Street, New York, NY 10001
      </p>
    </div>
  )

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/app" element={<CompanyManagement />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
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

