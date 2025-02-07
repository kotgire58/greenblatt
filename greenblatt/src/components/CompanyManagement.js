"use client"

import { useState } from "react"
import AddCompany from "./AddCompany"
import CompaniesTable from "./CompaniesTable"
import GraphModal from "./GraphModal"

const CompanyManagement = ({ companies, loading, error, refreshCompanies, deleteCompany }) => {
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false)

  return (
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
}

export default CompanyManagement

