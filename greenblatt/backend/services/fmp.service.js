const axios = require("axios")

const BASE_URL = "https://financialmodelingprep.com/stable"

const getApiKey = () => {
  const apiKey = process.env.FMP_API_KEY
  if (!apiKey) {
    throw new Error("FMP_API_KEY is missing in backend environment variables.")
  }
  return apiKey
}

const isFmpAccessError = (err) => {
  if (err?.isFmpAccessError) return true
  const status = err?.response?.status
  return status === 401 || status === 402 || status === 403
}

const buildCandidates = (inputSymbol) => {
  const base = inputSymbol.toUpperCase()
  return base.includes(".") ? [base] : [base, `${base}.NS`, `${base}.BO`]
}

const getArray = async (path, params = {}) => {
  const apiKey = getApiKey()
  const response = await axios.get(`${BASE_URL}${path}`, {
    params: {
      ...params,
      apikey: apiKey,
    },
    timeout: 12000,
  })
  return Array.isArray(response.data) ? response.data : []
}

const getSymbolSnapshot = async (symbol) => {
  const [income, balance, quote] = await Promise.all([
    getArray(`/income-statement`, { symbol, period: "annual", limit: 1 }),
    getArray(`/balance-sheet-statement`, { symbol, period: "annual", limit: 1 }),
    getArray(`/quote`, { symbol }),
  ])

  return {
    income: income[0],
    balance: balance[0],
    quote: quote[0],
  }
}

const resolveSymbolWithFmp = async (inputSymbol) => {
  const candidates = buildCandidates(inputSymbol)
  let sawAccessError = false

  for (const candidate of candidates) {
    try {
      const quote = await getArray(`/quote`, { symbol: candidate })
      if (quote[0]?.symbol) {
        return candidate
      }
    } catch (err) {
      if ((err?.message || "").includes("FMP_API_KEY is missing")) {
        throw err
      }
      if (isFmpAccessError(err)) {
        sawAccessError = true
      }
      console.error(`[fmp] Quote lookup failed for '${candidate}':`, err?.message || err)
    }
  }

  if (sawAccessError) {
    const err = new Error("FMP access denied for this key/plan.")
    err.isFmpAccessError = true
    throw err
  }

  throw new Error("Symbol not found on US, NSE, or BSE.")
}

module.exports = {
  getArray,
  getSymbolSnapshot,
  resolveSymbolWithFmp,
  isFmpAccessError,
}
