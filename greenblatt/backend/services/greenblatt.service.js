const { getQuote, getQuoteSummary, getFundamentals } = require("./yahoo.service")
const  resolveSymbol  = require("./symbolResolver.service")
const { latest } = require("../utils/helpers")

const calculateGreenblatt = async (inputSymbol) => {
  let symbol = await resolveSymbol(inputSymbol)

  const [fts, quoteSummary, quote] = await Promise.all([
    getFundamentals(symbol),
    getQuoteSummary(symbol, ["financialData", "defaultKeyStatistics"]),
    getQuote(symbol),
  ])

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

  const earningYield =
    enterpriseValue !== 0 ? EBIT / enterpriseValue : 0

  const denominator =
    (netFixedAssets || 0) + (netWorkingCapital || 0)

  const ROC =
    denominator !== 0 ? EBIT / denominator : 0

  return {
    symbol,
    EBIT,
    marketCap,
    debt: totalDebt,
    cash,
    netFixedAssets,
    netWorkingCapital,
    enterpriseValue,
    earningYield,
    ROC,
  }
}

module.exports = calculateGreenblatt    