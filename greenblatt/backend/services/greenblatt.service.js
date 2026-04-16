const { getSymbolSnapshot, resolveSymbolWithFmp, isFmpAccessError } = require("./fmp.service")
const { getQuote, getQuoteSummary, getFundamentals } = require("./yahoo.service")
const resolveSymbol = require("./symbolResolver.service")
const { latest } = require("../utils/helpers")

const calculateGreenblattWithYahoo = async (inputSymbol) => {
  const symbol = await resolveSymbol(inputSymbol)

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
  const marketCap = quote.marketCap || financials.marketCap || keyStats.marketCap || 0
  const totalDebt = financials.totalDebt || latest(fts, "totalDebt") || 0
  const cash = financials.totalCash || latest(fts, "cashAndCashEquivalents") || 0
  const enterpriseValue = (marketCap || 0) + (totalDebt || 0) - (cash || 0)
  const earningYield = enterpriseValue !== 0 ? EBIT / enterpriseValue : 0
  const denominator = (netFixedAssets || 0) + (netWorkingCapital || 0)
  const ROC = denominator !== 0 ? EBIT / denominator : 0

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

const calculateGreenblatt = async (inputSymbol) => {
  try {
    const symbol = await resolveSymbolWithFmp(inputSymbol)
    const { income, balance, quote } = await getSymbolSnapshot(symbol)

    if (!income || !balance) {
      throw new Error("Financial data unavailable for this symbol.")
    }

    const EBIT = Number(income.ebit) || 0
    const netFixedAssets = Number(balance.propertyPlantEquipmentNet) || 0
    const currentAssets = Number(balance.totalCurrentAssets) || 0
    const currentLiabilities = Number(balance.totalCurrentLiabilities) || 0

    const netWorkingCapital = currentAssets - currentLiabilities

    const marketCap = Number(quote?.marketCap) || 0

    const totalDebt = Number(balance.totalDebt) || 0

    const cash = Number(balance.cashAndCashEquivalents) || 0

    const enterpriseValue = (marketCap || 0) + (totalDebt || 0) - (cash || 0)

    const earningYield = enterpriseValue !== 0 ? EBIT / enterpriseValue : 0

    const denominator = (netFixedAssets || 0) + (netWorkingCapital || 0)

    const ROC = denominator !== 0 ? EBIT / denominator : 0

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
  } catch (err) {
    if (isFmpAccessError(err)) {
      console.warn("[greenblatt] FMP access denied, falling back to Yahoo provider.")
      return calculateGreenblattWithYahoo(inputSymbol)
    }
    throw err
  }
}

module.exports = calculateGreenblatt    