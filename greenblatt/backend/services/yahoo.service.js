const YahooFinance = require("yahoo-finance2").default

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
})

const getQuote = (symbol) => yahooFinance.quote(symbol)

const getQuoteSummary = (symbol, modules) =>
  yahooFinance.quoteSummary(symbol, { modules })

const getFundamentals = (symbol) =>
  yahooFinance.fundamentalsTimeSeries(symbol, {
    period1: new Date("2022-01-01"),
    period2: new Date(),
    type: "annual",
    module: "all",
  })

module.exports = {
  getQuote,
  getQuoteSummary,
  getFundamentals,
}