const { getQuoteSummary } = require("../services/yahoo.service")
const YahooFinance = require("yahoo-finance2").default
const yahooFinance = new YahooFinance()
const resolveSymbol = require("../services/symbolResolver.service")
const calculateBuffettScore = require("../services/buffett.service")
const analyzeWithLLM = require("../services/llm.service")
const { isValidSymbol } = require("../utils/helpers")
const redis = require("../services/redis.service")

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function resolveEBIT(financials) {
  if (financials?.ebit) return financials.ebit
  if (financials?.operatingIncome) return financials.operatingIncome
  if (financials?.ebitda && financials?.depreciation)
    return financials.ebitda - financials.depreciation
  return null
}

function resolveInterestExpense(financials, cashflow) {
  if (cashflow?.interestExpense) return cashflow.interestExpense
  if (financials?.interestExpense) return financials.interestExpense
  return null
}

function computeInterestCoverage(ebit, interestExpense) {
  if (!ebit || !interestExpense || interestExpense === 0) return null
  return Math.abs(ebit / interestExpense)
}

// ─────────────────────────────────────────────
// Controller
// ─────────────────────────────────────────────

exports.getBuffettAnalysis = async (req, res, next) => {
  try {
    let symbol = req.params.symbol.toUpperCase()

    if (!isValidSymbol(symbol)) {
      return res.status(400).json({ error: "Invalid ticker." })
    }

    symbol = await resolveSymbol(symbol)

    const metricsCacheKey = `buffett:metrics:${symbol}`
    const llmCacheKey = `buffett:llm:${symbol}`

    let score, metrics, breakdown, derived

    // ─────────────────────────────────────────────
    // 1️⃣ Try Metrics Cache
    // ─────────────────────────────────────────────

    const cachedMetrics = await redis.get(metricsCacheKey)

    if (cachedMetrics) {
      console.log("Metrics cache hit")
      score = cachedMetrics.score
      metrics = cachedMetrics.metrics
      breakdown = cachedMetrics.breakdown
      derived = cachedMetrics.derived
    } else {
      console.log("Metrics cache miss")

      // ─────────────────────────────────────────────
      // Fetch Financial Data
      // ─────────────────────────────────────────────

      const qs = await getQuoteSummary(symbol, [
        "financialData",
        "summaryDetail",
        "cashflowStatementHistory",
      ])

      if (!qs?.financialData) {
        return res
          .status(404)
          .json({ error: "Financial data unavailable." })
      }

      const financials = qs.financialData
      const summary = qs.summaryDetail || {}

      const ebit = resolveEBIT(financials)

      const cashflows =
        qs.cashflowStatementHistory?.cashflowStatements || []

      const latestCashflow = cashflows[0] || {}

      const interestExpense = resolveInterestExpense(
        financials,
        latestCashflow
      )

      const interestCoverage = computeInterestCoverage(
        ebit,
        interestExpense
      )

      // ─────────────────────────────────────────────
      // Build Metrics Object
      // ─────────────────────────────────────────────

      metrics = {
        roe: financials.returnOnEquity ?? null,
        roic: null,
        grossMargin: financials.grossMargins ?? null,
        operatingMargin: financials.operatingMargins ?? null,
        debtToEquity: financials.debtToEquity ?? null,
        revenueGrowth: financials.revenueGrowth ?? null,
        earningsGrowth: financials.earningsGrowth ?? null,
        pe: summary.trailingPE ?? null,
        freeCashFlow: financials.freeCashflow ?? null,
        marketCap:
          financials.marketCap ??
          summary.marketCap ??
          null,
        revenue: financials.totalRevenue ?? null,
        currentRatio: financials.currentRatio ?? null,
        interestCoverage,
        historicalEarnings: [],
        historicalGrossMargins: [],
        riskFreeRate: 0.045,
      }

      score = calculateBuffettScore(metrics)
      breakdown = score.breakdown
      derived = score.derived

      // Cache metrics for 6 hours
      await redis.set(
        metricsCacheKey,
        { score, metrics, breakdown, derived },
        { ex: 60 * 60 * 6 }
      )
    }

    // ─────────────────────────────────────────────
    // 2️⃣ Try LLM Cache
    // ─────────────────────────────────────────────

    let llmAnalysis = await redis.get(llmCacheKey)

    if (llmAnalysis) {
      console.log("LLM cache hit")
    } else {
      console.log("LLM cache miss")

      llmAnalysis = await analyzeWithLLM({
        ticker: symbol,
        buffettScore: score.total,
        breakdown,
        derived,
        metrics
      })

      // Cache LLM for 24 hours
      await redis.set(
        llmCacheKey,
        llmAnalysis,
        { ex: 60 * 60 * 24 }
      )
    }

    // ─────────────────────────────────────────────
    // Final Response
    // ─────────────────────────────────────────────

    res.json({
      ticker: symbol,
      buffettScore: score.total,
      breakdown,
      derived,
      metrics,
      llmAnalysis
    })

  } catch (err) {
    next(err)
  }
}