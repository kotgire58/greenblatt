"use client"

import { useState, useMemo } from "react"
import AddCompany from "./AddCompany"
import CompaniesTable from "./CompaniesTable"
import GraphModal from "./GraphModal"
import { BarChart3 } from "lucide-react"

const CompanyManagement = ({
  companies,
  loading,
  error,
  refreshCompanies,
  deleteCompany,
}) => {
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false)

  /* ===== Derived Metrics ===== */
  const stats = useMemo(() => {
    if (!companies.length) {
      return {
        total: 0,
        avgEY: 0,
        avgROC: 0,
        best: null,
      }
    }

    const total = companies.length

    const avgEY =
      companies.reduce((sum, c) => sum + (c.earningYield || 0), 0) / total

    const avgROC =
      companies.reduce((sum, c) => sum + (c.ROC || 0), 0) / total

    const best = [...companies].sort(
      (a, b) => a.greenBlattsValue - b.greenBlattsValue
    )[0]

    return { total, avgEY, avgROC, best }
  }, [companies])

  return (
    <div className="container mx-auto px-6 py-16">

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-14">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Magic Formula <span className="text-emerald-400">Screener</span>
          </h1>
          <p className="text-slate-400 mt-3">
            Rank companies by Earnings Yield and Return on Capital.
          </p>
        </div>

        <button
          onClick={() => setIsGraphModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-emerald-300 transition"
        >
          <BarChart3 size={18} />
          Visualize Rankings
        </button>
      </div>

      {/* ===== ADD COMPANY ===== */}
      <AddCompany refreshCompanies={refreshCompanies} />

      {/* ===== ERROR STATE ===== */}
      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* ===== STATS CARDS ===== */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-14 mb-16">
          <StatCard label="Companies Screened" value={stats.total} />
          <StatCard
            label="Average Earnings Yield"
            value={`${(stats.avgEY * 100).toFixed(2)}%`}
          />
          <StatCard
            label="Average ROC"
            value={`${(stats.avgROC * 100).toFixed(2)}%`}
          />
          <StatCard
            label="Top Ranked"
            value={stats.best ? stats.best.ticker : "-"}
            highlight
          />
        </div>
      )}

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <CompaniesTable
          companies={companies}
          deleteCompany={deleteCompany}
        />
      )}

      {/* ===== GRAPH MODAL ===== */}
      <GraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        companies={companies}
      />
    </div>
  )
}

/* ===== STAT CARD COMPONENT ===== */

const StatCard = ({ label, value, highlight }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-400/30 transition">
    <p className="text-slate-500 text-sm uppercase tracking-wide">
      {label}
    </p>

    <p
      className={`mt-4 text-3xl font-bold ${
        highlight ? "text-emerald-400" : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
)

export default CompanyManagement