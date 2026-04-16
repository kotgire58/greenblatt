const { resolveSymbolWithFmp, getArray, isFmpAccessError } = require("../services/fmp.service")
const { getQuoteSummary } = require("../services/yahoo.service")
const resolveSymbol = require("../services/symbolResolver.service")
const calculateBuffettScore = require("../services/buffett.service")
const analyzeWithLLM = require("../services/llm.service")
const { isValidSymbol } = require("../utils/helpers")
const redis = require("../services/redis.service")

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function resolveEBIT(income) {
  if (income?.ebit != null) return Number(income.ebit)
  if (income?.operatingIncome != null) return Number(income.operatingIncome)
  if (income?.ebitda != null && income?.depreciationAndAmortization != null) {
    return Number(income.ebitda) - Number(income.depreciationAndAmortization)
  }
  return null
}

function resolveInterestExpense(income) {
  if (income?.interestExpense != null) return Number(income.interestExpense)
  return null
}

function computeInterestCoverage(ebit, interestExpense) {
  if (!ebit || !interestExpense || interestExpense === 0) return null
  return Math.abs(ebit / interestExpense)
}

const buildMetricsFromYahoo = async (symbol) => {
  const qs = await getQuoteSummary(symbol, [
    "financialData",
    "summaryDetail",
    "cashflowStatementHistory",
  ])

  if (!qs?.financialData) {
    return null
  }

  const financials = qs.financialData
  const summary = qs.summaryDetail || {}
  const ebit = financials?.ebit ?? financials?.operatingIncome ?? null
  const cashflows = qs.cashflowStatementHistory?.cashflowStatements || []
  const latestCashflow = cashflows[0] || {}
  const interestExpense = latestCashflow?.interestExpense ?? financials?.interestExpense ?? null
  const interestCoverage = computeInterestCoverage(ebit, interestExpense)

  return {
    roe: financials.returnOnEquity ?? null,
    roic: null,
    grossMargin: financials.grossMargins ?? null,
    operatingMargin: financials.operatingMargins ?? null,
    debtToEquity: financials.debtToEquity ?? null,
    revenueGrowth: financials.revenueGrowth ?? null,
    earningsGrowth: financials.earningsGrowth ?? null,
    pe: summary.trailingPE ?? null,
    freeCashFlow: financials.freeCashflow ?? null,
    marketCap: financials.marketCap ?? summary.marketCap ?? null,
    revenue: financials.totalRevenue ?? null,
    currentRatio: financials.currentRatio ?? null,
    interestCoverage,
    historicalEarnings: [],
    historicalGrossMargins: [],
    riskFreeRate: 0.045,
  }
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

    let usingYahooFallback = false

    try {
      symbol = await resolveSymbolWithFmp(symbol)
    } catch (err) {
      if (!isFmpAccessError(err)) {
        throw err
      }
      console.warn("[buffett] FMP access denied, falling back to Yahoo symbol resolution.")
      symbol = await resolveSymbol(symbol)
      usingYahooFallback = true
    }

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

      try {
        if (!usingYahooFallback) {
          const [
            incomeRes,
            balanceRes,
            cashFlowRes,
            ratiosRes,
            growthRes,
            quoteRes
          ] = await Promise.all([
            getArray("/income-statement", { symbol, period: "annual", limit: 1 }),
            getArray("/balance-sheet-statement", { symbol, period: "annual", limit: 1 }),
            getArray("/cash-flow-statement", { symbol, period: "annual", limit: 1 }),
            getArray("/ratios", { symbol, period: "annual", limit: 1 }),
            getArray("/financial-growth", { symbol, period: "annual", limit: 1 }),
            getArray("/quote", { symbol })
          ])

          const income = incomeRes[0]
          const balance = balanceRes[0]
          const cashFlow = cashFlowRes[0]
          const ratios = ratiosRes[0]
          const growth = growthRes[0]
          const quote = quoteRes[0]

          if (!income || !balance) {
            return res
              .status(404)
              .json({ error: "Financial data unavailable." })
          }

          const ebit = resolveEBIT(income)
          const interestExpense = resolveInterestExpense(income)
          const interestCoverage = computeInterestCoverage(ebit, interestExpense)

          metrics = {
            roe: ratios?.returnOnEquity ?? null,
            roic:
              ratios?.returnOnCapitalEmployed ??
              ratios?.returnOnCapital ??
              null,
            grossMargin: ratios?.grossProfitMargin ?? null,
            operatingMargin: ratios?.operatingProfitMargin ?? null,
            debtToEquity:
              ratios?.debtToEquityRatio ??
              ratios?.debtEquityRatio ??
              null,
            revenueGrowth: growth?.revenueGrowth ?? null,
            earningsGrowth: growth?.netIncomeGrowth ?? null,
            pe:
              ratios?.priceToEarningsRatio ??
              ratios?.priceEarningsRatio ??
              quote?.pe ??
              null,
            freeCashFlow: cashFlow?.freeCashFlow ?? null,
            marketCap: quote?.marketCap ?? null,
            revenue: income?.revenue ?? null,
            currentRatio: ratios?.currentRatio ?? null,
            interestCoverage,
            historicalEarnings: [],
            historicalGrossMargins: [],
            riskFreeRate: 0.045,
          }
        } else {
          metrics = await buildMetricsFromYahoo(symbol)
        }
      } catch (err) {
        if (!isFmpAccessError(err)) {
          throw err
        }
        console.warn("[buffett] FMP access denied while loading metrics, falling back to Yahoo.")
        metrics = await buildMetricsFromYahoo(symbol)
      }

      if (!metrics) {
        return res
          .status(404)
          .json({ error: "Financial data unavailable." })
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