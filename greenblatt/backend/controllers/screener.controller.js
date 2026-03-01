// controllers/screener.controller.js

const calculateGreenblatt = require("../services/greenblatt.service")
const calculateBuffettScore = require("../services/buffett.service")
const analyzeWithLLM = require("../services/llm.service")
const redis = require("../services/redis.service")

exports.getScreenerAnalysis = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase()

    const metrics = await calculateGreenblatt(symbol)

    const llmCacheKey = `screener:llm:${symbol}`

    let llmAnalysis = await redis.get(llmCacheKey)

    if (!llmAnalysis) {
      llmAnalysis = await analyzeWithLLM({
        ticker: symbol,
        greenblatt: metrics
      })

      await redis.set(llmCacheKey, llmAnalysis, {
        ex: 60 * 60 * 24
      })
    }

    res.json({
      symbol,
      metrics,
      llmAnalysis
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}