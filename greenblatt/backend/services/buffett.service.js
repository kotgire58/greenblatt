// services/buffett.service.js

const clamp = (val, min, max) =>
  Math.max(min, Math.min(max, val))

const neutral = (maxPoints) => Math.round(maxPoints / 2)

const calculateBuffettScore = (metrics) => {
  const {
    roe,
    grossMargin,
    operatingMargin,
    debtToEquity,
    earningsGrowth,
    pe,
    freeCashFlow,
    marketCap,
    currentRatio,
    interestCoverage,
    roic,
    historicalEarnings = [],
    historicalGrossMargins = [],
    revenue,
    riskFreeRate = 0.045,
  } = metrics

  let capitalEfficiency = 0
  let businessQuality = 0
  let financialStrength = 0
  let valuationDiscipline = 0

  /* ===============================
     1️⃣ CAPITAL EFFICIENCY (25)
  =============================== */

  const returnOnCapital = roic ?? roe ?? null

  if (returnOnCapital == null)
    capitalEfficiency += neutral(12)
  else if (returnOnCapital > 0.25)
    capitalEfficiency += 12
  else if (returnOnCapital > 0.18)
    capitalEfficiency += 10
  else if (returnOnCapital > 0.12)
    capitalEfficiency += 6
  else if (returnOnCapital > 0.08)
    capitalEfficiency += 3
  else capitalEfficiency += 1

  let fcfMargin = null
  if (revenue && freeCashFlow)
    fcfMargin = freeCashFlow / revenue

  if (fcfMargin == null)
    capitalEfficiency += neutral(13)
  else if (fcfMargin > 0.25)
    capitalEfficiency += 13
  else if (fcfMargin > 0.15)
    capitalEfficiency += 10
  else if (fcfMargin > 0.08)
    capitalEfficiency += 6
  else if (fcfMargin > 0.03)
    capitalEfficiency += 3
  else capitalEfficiency += 1

  /* ===============================
     2️⃣ BUSINESS QUALITY (35)
  =============================== */

  // Gross Margin
  if (grossMargin == null)
    businessQuality += neutral(8)
  else if (grossMargin > 0.6)
    businessQuality += 8
  else if (grossMargin > 0.45)
    businessQuality += 6
  else if (grossMargin > 0.3)
    businessQuality += 3
  else businessQuality += 1

  // Margin Stability
  if (historicalGrossMargins.length >= 3) {
    const min = Math.min(...historicalGrossMargins)
    const max = Math.max(...historicalGrossMargins)
    const spread = max - min
    if (spread < 0.04) businessQuality += 7
    else if (spread < 0.08) businessQuality += 5
    else businessQuality += 2
  } else {
    businessQuality += neutral(7)
  }

  // Operating Margin
  if (operatingMargin == null)
    businessQuality += neutral(8)
  else if (operatingMargin > 0.3)
    businessQuality += 8
  else if (operatingMargin > 0.18)
    businessQuality += 6
  else if (operatingMargin > 0.1)
    businessQuality += 3
  else businessQuality += 1

  // Earnings Consistency
  if (historicalEarnings.length >= 5) {
    const allPositive = historicalEarnings.every(e => e > 0)
    const growing = historicalEarnings.every(
      (e, i) => i === 0 || e >= historicalEarnings[i - 1]
    )

    if (allPositive && growing)
      businessQuality += 12
    else if (allPositive)
      businessQuality += 8
    else businessQuality += 3
  } else if (earningsGrowth != null) {
    if (earningsGrowth > 0.15)
      businessQuality += 8
    else if (earningsGrowth > 0.07)
      businessQuality += 5
    else businessQuality += 3
  } else {
    businessQuality += neutral(12)
  }

  /* ===============================
     3️⃣ FINANCIAL STRENGTH (25)
  =============================== */

  // Debt-to-Equity
  if (debtToEquity == null)
    financialStrength += neutral(10)
  else if (debtToEquity < 40)
    financialStrength += 10
  else if (debtToEquity < 100)
    financialStrength += 7
  else if (debtToEquity < 180)
    financialStrength += 4
  else financialStrength += 1

  // Current Ratio
  if (currentRatio == null)
    financialStrength += neutral(8)
  else if (currentRatio > 1.8)
    financialStrength += 8
  else if (currentRatio > 1.2)
    financialStrength += 6
  else if (currentRatio > 1)
    financialStrength += 4
  else financialStrength += 2

  // Interest Coverage
  if (interestCoverage == null)
    financialStrength += neutral(7)
  else if (interestCoverage > 15)
    financialStrength += 7
  else if (interestCoverage > 8)
    financialStrength += 5
  else if (interestCoverage > 4)
    financialStrength += 3
  else financialStrength += 1

  /* ===============================
     4️⃣ VALUATION DISCIPLINE (15)
  =============================== */

  let fcfYield = null
  if (marketCap && freeCashFlow)
    fcfYield = freeCashFlow / marketCap

  let equityBondSpread = null
  if (fcfYield != null)
    equityBondSpread = fcfYield - riskFreeRate

  if (equityBondSpread == null)
    valuationDiscipline += neutral(15)
  else if (equityBondSpread > 0.05)
    valuationDiscipline += 15
  else if (equityBondSpread > 0.03)
    valuationDiscipline += 12
  else if (equityBondSpread > 0.01)
    valuationDiscipline += 8
  else if (equityBondSpread > 0)
    valuationDiscipline += 5
  else valuationDiscipline += 2

  const total =
    capitalEfficiency +
    businessQuality +
    financialStrength +
    valuationDiscipline

  return {
    total: clamp(total, 0, 100),
    breakdown: {
      capitalEfficiency,
      businessQuality,
      financialStrength,
      valuationDiscipline,
    },
    derived: {
      fcfMargin,
      fcfYield,
      equityBondSpread,
      returnOnCapital,
    },
  }
}

module.exports = calculateBuffettScore