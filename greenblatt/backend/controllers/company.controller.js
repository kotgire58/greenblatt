const Company = require("../models/Company")
const calculateGreenblatt = require("../services/greenblatt.service")

exports.getCompany = async (req, res, next) => {
  try {
    const data = await calculateGreenblatt(req.params.symbol)

    const company = await Company.findOneAndUpdate(
      { ticker: data.symbol },
      { ...data, ticker: data.symbol, lastUpdated: new Date() },
      { new: true, upsert: true }
    )

    res.json(company)
  } catch (err) {
    next(err)
  }
}

exports.getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find()

    const sortedEY = [...companies].sort(
      (a, b) => (b.earningYield || 0) - (a.earningYield || 0)
    )

    const sortedROC = [...companies].sort(
      (a, b) => (b.ROC || 0) - (a.ROC || 0)
    )

    const eyRanks = new Map()
    const rocRanks = new Map()

    sortedEY.forEach((c, i) =>
      eyRanks.set(c._id.toString(), i + 1)
    )

    sortedROC.forEach((c, i) =>
      rocRanks.set(c._id.toString(), i + 1)
    )

    const ranked = companies.map((c) => {
      const earningYieldRank = eyRanks.get(c._id.toString())
      const ROCRank = rocRanks.get(c._id.toString())

      return {
        ...c._doc,
        earningYieldRank,
        ROCRank,
        greenBlattsValue:
          earningYieldRank + ROCRank,
      }
    })

    ranked.sort(
      (a, b) => a.greenBlattsValue - b.greenBlattsValue
    )

    res.json(ranked)
  } catch (err) {
    next(err)
  }
}