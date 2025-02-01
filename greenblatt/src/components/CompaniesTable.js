import { useState } from "react"

function CompaniesTable({ companies, deleteCompany }) {
  const [sortColumn, setSortColumn] = useState("greenBlattsValue")
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedCompanies = [...companies].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const formatNumber = (number, decimals = 0) => {
    return number.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteCompany(id)
    }
  }

  const renderSortIcon = (column) => {
    if (column !== sortColumn) return null
    return sortDirection === "asc" ? "▲" : "▼"
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Companies Greenblatt Rankings</h2>
      {companies.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No companies found. Add a company to see it listed here.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300" role="table">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left" onClick={() => handleSort("name")} role="columnheader">
                Name {renderSortIcon("name")}
              </th>
              <th className="px-4 py-2 text-right" onClick={() => handleSort("EBIT")} role="columnheader">
                EBIT {renderSortIcon("EBIT")}
              </th>
              <th
                className="px-4 py-2 text-right"
                onClick={() => handleSort("computedEnterpriseValue")}
                role="columnheader"
              >
                Enterprise Value {renderSortIcon("computedEnterpriseValue")}
              </th>
              <th className="px-4 py-2 text-right" onClick={() => handleSort("earningYield")} role="columnheader">
                Earning Yield {renderSortIcon("earningYield")}
              </th>
              <th className="px-4 py-2 text-right" onClick={() => handleSort("earningYieldRank")} role="columnheader">
                Earning Yield Rank {renderSortIcon("earningYieldRank")}
              </th>
              <th className="px-4 py-2 text-right" onClick={() => handleSort("ROC")} role="columnheader">
                ROC {renderSortIcon("ROC")}
              </th>
              <th className="px-4 py-2 text-right" onClick={() => handleSort("ROCRank")} role="columnheader">
                ROC Rank {renderSortIcon("ROCRank")}
              </th>
              <th className="px-4 py-2 text-right" onClick={() => handleSort("greenBlattsValue")} role="columnheader">
                Greenblatt's Value {renderSortIcon("greenBlattsValue")}
              </th>
              <th className="px-4 py-2 text-center" role="columnheader">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map((company) => (
              <tr key={company._id} className="border-t border-gray-200 hover:bg-gray-50" role="row">
                <td className="px-4 py-2" role="cell">
                  {company.name}
                </td>
                <td className="px-4 py-2 text-right" role="cell">
                  {formatNumber(company.EBIT)}
                </td>
                <td className="px-4 py-2 text-right" role="cell">
                  {formatNumber(company.computedEnterpriseValue)}
                </td>
                <td className="px-4 py-2 text-right" role="cell">
                  {formatNumber(company.earningYield*100, 3)}%
                </td>
                <td className="px-4 py-2 text-right" role="cell">
                  {company.earningYieldRank}
                </td>
                <td className="px-4 py-2 text-right" role="cell">
                  {formatNumber(company.ROC*100, 2)}%
                </td>
                <td className="px-4 py-2 text-right" role="cell">
                  {company.ROCRank}
                </td>
                <td className="px-4 py-2 text-right" role="cell">
                  {company.greenBlattsValue}
                </td>
                <td className="px-4 py-2 text-center" role="cell">
                  <button
                    onClick={() => handleDelete(company._id, company.name)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    aria-label={`Delete ${company.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CompaniesTable

