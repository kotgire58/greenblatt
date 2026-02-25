const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const YahooFinance = require("yahoo-finance2").default
const Company = require("./models/Company")

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
})

const app = express()

/* ===============================
   MIDDLEWARE
================================= */

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

// Basic rate limiting (avoid Yahoo throttling)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
})
app.use(limiter)

/* ===============================
   DATABASE
================================= */

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/greenblatt"

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

/* ===============================
   HELPERS
================================= */

// Get latest non-zero value from array
function latest(series, key) {
  if (!Array.isArray(series)) return 0
  for (let i = series.length - 1; i >= 0; i--) {
    const val = series[i]?.[key]
    if (val != null && val !== 0) return val
  }
  return 0
}

// Validate ticker symbol
function isValidSymbol(symbol) {
  return /^[A-Z.]{1,10}$/.test(symbol)
}

/* ===============================
   ROUTES
================================= */

// DEBUG ROUTE
app.get("/api/debug/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase()

  try {
    const result = await yahooFinance.fundamentalsTimeSeries(symbol, {
      period1: new Date("2022-01-01"),
      period2: new Date(),
      type: "annual",
      module: "all",
    })

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* ===================================
   FETCH + STORE COMPANY DATA
=================================== */

app.get("/api/company/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase()

    if (!isValidSymbol(symbol)) {
      return res.status(400).json({ error: "Invalid ticker symbol format." })
    }

    const [fts, quoteSummary, quote] = await Promise.all([
      yahooFinance.fundamentalsTimeSeries(symbol, {
        period1: new Date("2022-01-01"),
        period2: new Date(),
        type: "annual",
        module: "all",
      }),
      yahooFinance.quoteSummary(symbol, {
        modules: ["financialData", "defaultKeyStatistics"],
      }),
      yahooFinance.quote(symbol),
    ])

    if (!Array.isArray(fts) || fts.length === 0) {
      return res
        .status(404)
        .json({ error: "No financial time series data available." })
    }

    /* ========= Extract Correct Fields ========= */

    const EBIT = latest(fts, "EBIT")
    const netFixedAssets = latest(fts, "netPPE")
    const currentAssets = latest(fts, "currentAssets")
    const currentLiabilities = latest(fts, "currentLiabilities")

    const netWorkingCapital = currentAssets - currentLiabilities

    const financials = quoteSummary.financialData || {}
    const keyStats = quoteSummary.defaultKeyStatistics || {}

    const marketCap =
      quote.marketCap ||
      financials.marketCap ||
      keyStats.marketCap ||
      0

    const totalDebt =
      financials.totalDebt || latest(fts, "totalDebt") || 0

    const cash =
      financials.totalCash ||
      latest(fts, "cashAndCashEquivalents") ||
      0

    const enterpriseValue =
      (marketCap || 0) + (totalDebt || 0) - (cash || 0)

    const companyData = {
      name: symbol,
      EBIT,
      marketCap,
      debt: totalDebt,
      cash,
      netFixedAssets,
      netWorkingCapital,
      enterpriseValue,
    }

    const company = await Company.findOneAndUpdate(
      { name: symbol },
      companyData,
      { new: true, upsert: true }
    )

    res.json(company)
  } catch (error) {
    console.error("Yahoo Finance error:", error.message)

    if (
      error.message?.includes("Not Found") ||
      error.message?.includes("No fundamentals")
    ) {
      return res.status(404).json({
        error: `Symbol "${req.params.symbol}" not found or has no financial data.`,
      })
    }

    res.status(500).json({
      error: `Failed to fetch data for ${req.params.symbol}`,
    })
  }
})

/* ===================================
   GET ALL COMPANIES + RANK
=================================== */

app.get("/api/companies", async (req, res) => {
  try {
    let companies = await Company.find()

    if (!companies.length) return res.json([])

    companies = companies.map((c) => {
      const EBIT = c.EBIT || 0
      const enterpriseValue =
        (c.marketCap || 0) + (c.debt || 0) - (c.cash || 0)

      const earningYield =
        enterpriseValue !== 0 ? EBIT / enterpriseValue : 0

      const denominator =
        (c.netFixedAssets || 0) + (c.netWorkingCapital || 0)

      const ROC =
        denominator !== 0 ? EBIT / denominator : 0

      return {
        ...c._doc,
        computedEnterpriseValue: enterpriseValue,
        earningYield,
        ROC,
      }
    })

    /* ===== Efficient Ranking ===== */

    const sortedEY = [...companies].sort(
      (a, b) => b.earningYield - a.earningYield
    )

    const sortedROC = [...companies].sort(
      (a, b) => b.ROC - a.ROC
    )

    const eyRanks = new Map()
    const rocRanks = new Map()

    sortedEY.forEach((c, i) =>
      eyRanks.set(c._id.toString(), i + 1)
    )

    sortedROC.forEach((c, i) =>
      rocRanks.set(c._id.toString(), i + 1)
    )

    companies = companies.map((c) => {
      const earningYieldRank = eyRanks.get(c._id.toString())
      const ROCRank = rocRanks.get(c._id.toString())
      const greenBlattsValue =
        earningYieldRank + ROCRank

      return {
        ...c,
        earningYieldRank,
        ROCRank,
        greenBlattsValue,
      }
    })

    companies.sort(
      (a, b) => a.greenBlattsValue - b.greenBlattsValue
    )

    res.json(companies)
  } catch (error) {
    res.status(500).json({
      error: `An error occurred: ${error.message}`,
    })
  }
})

/* ===================================
   DELETE COMPANY
=================================== */

app.delete("/api/companies/:id", async (req, res) => {
  try {
    const deleted = await Company.findByIdAndDelete(
      req.params.id
    )

    if (!deleted)
      return res
        .status(404)
        .json({ error: "Company not found" })

    res.json({ message: "Company deleted successfully" })
  } catch (error) {
    res.status(500).json({
      error: `An error occurred: ${error.message}`,
    })
  }
})

/* ===============================
   START SERVER
================================= */

const PORT = process.env.PORT || 5001
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)