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
        return candidate
      }
    } catch {
      continue
    }
  }

  throw new Error("Symbol not found on US, NSE, or BSE.")
}

module.exports = resolveSymbol