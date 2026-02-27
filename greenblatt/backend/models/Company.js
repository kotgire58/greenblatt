const mongoose = require("mongoose")

const CompanySchema = new mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
    },

    EBIT: { type: Number, required: true },

    enterpriseValue: { type: Number, required: true },

    marketCap: { type: Number },

    debt: { type: Number },

    cash: { type: Number },

    netFixedAssets: { type: Number },

    netWorkingCapital: { type: Number },

    earningYield: { type: Number },

    ROC: { type: Number },

    greenBlattsValue: { type: Number },

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Company", CompanySchema)