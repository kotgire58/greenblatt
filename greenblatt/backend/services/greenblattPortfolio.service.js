const Portfolio = require("../models/Portfolio")
const PortfolioHolding = require("../models/PortfolioHolding")
const calculateGreenblatt = require("./greenblatt.service")

const rankDescending = (items, key) => {
  const sorted = [...items].sort((a, b) => b[key] - a[key])
  sorted.forEach((item, index) => {
    item[`${key}Rank`] = index + 1
  })
  return sorted
}

const calculatePortfolioGreenblatt = async (portfolioId, userId) => {
  const portfolio = await Portfolio.findOne({
    _id: portfolioId,
    user: userId
  })

  if (!portfolio) {
    throw new Error("Portfolio not found")
  }

  const holdings = await PortfolioHolding.find({
    portfolio: portfolioId
  })

  if (!holdings.length) {
    return { portfolio, rankedHoldings: [] }
  }

  const enriched = await Promise.all(
    holdings.map(async (h) => {
      const metrics = await calculateGreenblatt(h.ticker)

      return {
        ticker: h.ticker,
        shares: h.shares,
        ...metrics
      }
    })
  )

  // Rank by earnings yield
  rankDescending(enriched, "earningYield")

  // Rank by ROC
  rankDescending(enriched, "ROC")

  enriched.forEach((item) => {
    item.combinedRank = item.earningYieldRank + item.ROCRank
  })

  enriched.sort((a, b) => a.combinedRank - b.combinedRank)

  const avgEarningsYield =
    enriched.reduce((sum, h) => sum + h.earningYield, 0) / enriched.length

  const avgROC =
    enriched.reduce((sum, h) => sum + h.ROC, 0) / enriched.length

  return {
    portfolio,
    summary: {
      avgEarningsYield,
      avgROC
    },
    rankedHoldings: enriched
  }
}

module.exports = calculatePortfolioGreenblatt