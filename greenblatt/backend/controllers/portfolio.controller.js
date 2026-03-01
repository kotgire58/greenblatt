const fs = require("fs")
const Portfolio = require("../models/Portfolio")
const PortfolioHolding = require("../models/PortfolioHolding")
const { parseCSV } = require("../services/portfolioIngest.service")
const { extractTextFromImage } = require("../services/ocr.service")
const { extractHoldingsFromText } = require("../services/portfolioLLM.service")
const calculatePortfolioGreenblatt = require("../services/greenblattPortfolio.service")


// ================= CREATE PORTFOLIO =================

exports.createPortfolio = async (req, res) => {
  try {
    const { name } = req.body

    const portfolio = await Portfolio.create({
      name,
      user: req.user.id
    })

    res.json(portfolio)

  } catch (err) {
    res.status(500).json({ error: "Failed to create portfolio" })
  }
}

// ================= GET USER PORTFOLIOS =================

exports.getUserPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user.id })
    res.json(portfolios)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolios" })
  }
}

// ================= CSV =================

exports.uploadCSV = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      user: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" })
    }

    const holdings = parseCSV(req.file.path)

    const holdingsWithPortfolio = holdings.map(h => ({
      ...h,
      portfolio: portfolio._id
    }))

    await PortfolioHolding.insertMany(holdingsWithPortfolio)

    fs.unlinkSync(req.file.path)

    res.json({ success: true, holdings: holdingsWithPortfolio })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "CSV upload failed" })
  }
}

// ================= IMAGE =================

exports.uploadImage = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      user: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" })
    }

    const text = await extractTextFromImage(req.file.path)
    const rawHoldings = await extractHoldingsFromText(text)

    const cleanedHoldings = rawHoldings
      .filter(h => h.ticker && h.shares && h.shares > 0)
      .map(h => ({
        ticker: h.ticker,
        shares: Number(h.shares),
        portfolio: portfolio._id
      }))

    if (cleanedHoldings.length === 0) {
      throw new Error("No valid holdings extracted")
    }

    await PortfolioHolding.insertMany(cleanedHoldings)

    fs.unlinkSync(req.file.path)

    res.json({
      success: true,
      holdings: cleanedHoldings
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

// ================= FETCH =================

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      user: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" })
    }

    const holdings = await PortfolioHolding.find({
      portfolio: portfolio._id
    })

    res.json({ portfolio, holdings })

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch portfolio" })
  }
}

// ================= DELETE =================

exports.deleteHolding = async (req, res) => {
  try {
    const holding = await PortfolioHolding.findOne({
      _id: req.params.holdingId
    })

    if (!holding) {
      return res.status(404).json({ error: "Holding not found" })
    }

    await PortfolioHolding.deleteOne({ _id: holding._id })

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({ error: "Failed to delete holding" })
  }
}

exports.getGreenblattRanking = async (req, res) => {
  try {
    const result = await calculatePortfolioGreenblatt(
      req.params.portfolioId,
      req.user.id
    )

    res.json(result)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.addHolding = async (req, res) => {
  try {
    const { ticker, shares } = req.body
    const { portfolioId } = req.params
    const userId = req.user.id

    if (!ticker || !shares) {
      return res.status(400).json({ error: "Ticker and shares required." })
    }

    const PortfolioHolding = require("../models/PortfolioHolding")

    const holding = await PortfolioHolding.create({
      user: userId,
      portfolio: portfolioId,
      ticker: ticker.toUpperCase(),
      shares
    })

    res.status(201).json({ message: "Holding added", holding })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to add holding." })
  }
}