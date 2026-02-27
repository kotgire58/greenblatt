"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react"

function CompaniesTable({ companies = [], deleteCompany }) {
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
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (aValue == null) return 1
    if (bValue == null) return -1

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const renderSortIcon = (column) => {
    if (column !== sortColumn) return null
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      {/* HEADER */}
      <div className="px-8 py-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold">
          Ranked Companies
        </h2>
        <p className="text-slate-400 mt-1 text-sm">
          Sorted by Greenblatt Composite Score
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          No companies added yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">

            {/* TABLE HEAD */}
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs tracking-wide">
              <tr>
                <th
                  className="px-6 py-4 text-left cursor-pointer hover:text-white transition"
                  onClick={() => handleSort("ticker")}
                >
                  Ticker {renderSortIcon("ticker")}
                </th>

                <th
                  className="px-6 py-4 text-right cursor-pointer hover:text-white transition"
                  onClick={() => handleSort("earningYield")}
                >
                  Earnings Yield {renderSortIcon("earningYield")}
                </th>

                <th
                  className="px-6 py-4 text-right cursor-pointer hover:text-white transition"
                  onClick={() => handleSort("ROC")}
                >
                  ROC {renderSortIcon("ROC")}
                </th>

                <th
                  className="px-6 py-4 text-right cursor-pointer hover:text-white transition"
                  onClick={() => handleSort("greenBlattsValue")}
                >
                  Rank {renderSortIcon("greenBlattsValue")}
                </th>

                <th className="px-6 py-4 text-center">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-800">
              {sortedCompanies.map((company) => (
                <tr
                  key={company._id}
                  className="hover:bg-slate-800/40 transition-all"
                >

                  {/* TICKER */}
                  <td className="px-6 py-4 font-semibold text-white">
                    {company.ticker || "-"}
                  </td>

                  {/* EARNINGS YIELD */}
                  <td className="px-6 py-4 text-right text-emerald-400 font-medium">
                    {company.earningYield != null
                      ? (company.earningYield * 100).toFixed(2) + "%"
                      : "-"}
                  </td>

                  {/* ROC */}
                  <td className="px-6 py-4 text-right text-cyan-400 font-medium">
                    {company.ROC != null
                      ? (company.ROC * 100).toFixed(2) + "%"
                      : "-"}
                  </td>

                  {/* RANK BADGE */}
                  <td className="px-6 py-4 text-right">
                    {company.greenBlattsValue != null ? (
                      <span className="inline-block px-3 py-1 rounded-lg bg-emerald-400/15 text-emerald-400 font-bold">
                        #{company.greenBlattsValue}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* DELETE BUTTON */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteCompany(company._id)}
                      className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={16} />
                      <span className="text-xs font-medium">Remove</span>
                    </button>
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

export default CompaniesTable