const fs = require("fs")
const { parse } = require("csv-parse/sync")

exports.parseCSV = (filePath) => {
  const content = fs.readFileSync(filePath)

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true
  })

  return records
    .map(row => ({
      ticker: (row.Ticker || row.Symbol)?.toUpperCase(),
      shares: Number(row.Shares || row.Quantity)
    }))
    .filter(r => r.ticker && r.shares > 0)
}