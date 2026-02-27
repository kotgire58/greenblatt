function latest(series, key) {
  if (!Array.isArray(series)) return 0
  for (let i = series.length - 1; i >= 0; i--) {
    const val = series[i]?.[key]
    if (val != null && val !== 0) return val
  }
  return 0
}

function isValidSymbol(symbol) {
  return /^[A-Z0-9.\-]{1,20}$/.test(symbol)
}

module.exports = { latest, isValidSymbol }