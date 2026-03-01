const mongoose = require("mongoose")

const PortfolioHoldingSchema = new mongoose.Schema(
  {
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true
    },
    ticker: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    shares: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("PortfolioHolding", PortfolioHoldingSchema)