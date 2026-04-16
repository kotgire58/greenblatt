const YahooFinance = require("yahoo-finance2").default

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isYahooRateLimited = (err) => {
  const message = err?.message || ""
  return err?.statusCode === 429 || /status\s*429|Too Many Requests|crumb/i.test(message)
}

const withYahooRetry = async (fn, context) => {
  const delaysMs = [400, 1000, 2000]
  let lastError

  for (let attempt = 0; attempt <= delaysMs.length; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (!isYahooRateLimited(err) || attempt === delaysMs.length) {
        throw err
      }

      const waitMs = delaysMs[attempt]
      console.warn(
        `[yahoo] Rate limited for ${context}; retry ${attempt + 1}/${delaysMs.length} in ${waitMs}ms`
      )
      await sleep(waitMs)
    }
  }

  throw lastError
}

const getQuote = (symbol) =>
  withYahooRetry(() => yahooFinance.quote(symbol), `quote:${symbol}`)

const getQuoteSummary = (symbol, modules) =>
  withYahooRetry(
    () => yahooFinance.quoteSummary(symbol, { modules }),
    `quoteSummary:${symbol}`
  )

const getFundamentals = (symbol) =>
  withYahooRetry(
    () =>
      yahooFinance.fundamentalsTimeSeries(symbol, {
        period1: new Date("2022-01-01"),
        period2: new Date(),
        type: "annual",
        module: "all",
      }),
    `fundamentals:${symbol}`
  )

module.exports = {
  getQuote,
  getQuoteSummary,
  getFundamentals,
  isYahooRateLimited,
}