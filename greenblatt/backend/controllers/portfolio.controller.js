const fs = require("fs")
const PortfolioHolding = require("../models/PortfolioHolding")
const { parseCSV } = require("../services/portfolioIngest.service")
const { extractTextFromImage } = require("../services/ocr.service")
const { extractHoldingsFromText } = require("../services/portfolioLLM.service")

// ================= CSV =================

exports.uploadCSV = async (req, res) => {
  try {
    const holdings = parseCSV(req.file.path)

    await PortfolioHolding.insertMany(holdings)

    fs.unlinkSync(req.file.path)

    res.json({ success: true, holdings })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "CSV upload failed" })
  }
}

// ================= IMAGE =================

exports.uploadImage = async (req, res) => {
  try {
    const text = await extractTextFromImage(req.file.path)
    const rawHoldings = await extractHoldingsFromText(text)

    const cleanedHoldings = rawHoldings
      .filter(h =>
        h.ticker &&
        h.shares &&
        h.shares > 0
      )
      .map(h => ({
        ticker: h.ticker,
        shares: Number(h.shares)
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
  const holdings = await PortfolioHolding.find()
  res.json({ holdings })
}

// ================= DELETE =================

exports.deleteHolding = async (req, res) => {
  await PortfolioHolding.findByIdAndDelete(req.params.id)
  res.json({ success: true })
}