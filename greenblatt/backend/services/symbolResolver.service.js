const { getQuote } = require("./yahoo.service")

const resolveSymbol = async (inputSymbol) => {
  const base = inputSymbol.toUpperCase()

  const candidates = base.includes(".")
    ? [base]
    : [base, `${base}.NS`, `${base}.BO`]

  for (const candidate of candidates) {
    try {
      const quote = await getQuote(candidate)
      if (quote?.regularMarketPrice) {
        console.log(`[screener] Resolved symbol '${base}' -> '${candidate}'`)
        return candidate
      }
      console.warn(
        `[screener] Candidate '${candidate}' returned no regularMarketPrice`
      )
    } catch (err) {
      console.error(
        `[screener] Candidate '${candidate}' lookup failed:`,
        err?.message || err
      )
      continue
    }
  }

  console.error(
    `[screener] Failed to resolve '${base}' on US/NSE/BSE candidates`
  )
  throw new Error("Symbol not found on US, NSE, or BSE.")
}

module.exports = resolveSymbol