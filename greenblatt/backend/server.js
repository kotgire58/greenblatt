const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const axios = require("axios")
const Company = require("./models/Company")

const app = express()

// Middleware
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your React app's URL
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())

// MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/Stock"
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

const API_KEY = "pLPywB6N66RixXehBZ15CZlNzYKyqP2L"

app.get("/api/company/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params

    // Fetch data from all three APIs
    const [incomeStatement, balanceSheet, marketCap] = await Promise.all([
      axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&apikey=${API_KEY}`),
      axios.get(
        `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?period=annual&apikey=${API_KEY}`,
      ),
      axios.get(`https://financialmodelingprep.com/api/v3/market-capitalization/${symbol}?apikey=${API_KEY}`),
    ])

    // Extract relevant data
    const income = incomeStatement.data[0]
    const balance = balanceSheet.data[0]
    const capData = marketCap.data[0]

    // Combine data into our Company model format
    const companyData = {
      name: income.symbol,
      EBIT: income.operatingIncome,
      marketCap: capData.marketCap,
      debt: balance.totalDebt,
      cash: balance.cashAndCashEquivalents,
      netFixedAssets: balance.propertyPlantEquipmentNet,
      netWorkingCapital: balance.totalCurrentAssets - balance.totalCurrentLiabilities,
      enterpriseValue: capData.marketCap + balance.totalDebt - balance.cashAndCashEquivalents,
    }

    // Save to database or update if exists
    const company = await Company.findOneAndUpdate({ name: companyData.name }, companyData, { new: true, upsert: true })

    res.json(company)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "An error occurred while fetching company data" })
  }
})

app.post("/api/companies", async (req, res) => {
  try {
    const companyData = req.body
    const newCompany = new Company(companyData)
    const savedCompany = await newCompany.save()
    res.json(savedCompany)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/companies", async (req, res) => {
  try {
    let companies = await Company.find()

    if (!companies || companies.length === 0) {
      return res.status(404).json({ error: "No companies found in the database." })
    }

    companies = companies.map((c) => {
      const EBIT = c.EBIT || 0
      const enterpriseValue = c.enterpriseValue || (c.marketCap || 0) + (c.debt || 0) - (c.cash || 0)
      const earningYield = enterpriseValue !== 0 ? EBIT / enterpriseValue : 0
      const denominator = (c.netFixedAssets || 0) + (c.netWorkingCapital || 0)
      const ROC = denominator !== 0 ? EBIT / denominator : 0

      return {
        ...c._doc,
        computedEnterpriseValue: enterpriseValue,
        earningYield,
        ROC,
      }
    })

    // Sort companies by Earning Yield (descending order)
    const sortedByEarningYield = [...companies].sort((a, b) => b.earningYield - a.earningYield)

    // Sort companies by ROC (descending order)
    const sortedByROC = [...companies].sort((a, b) => b.ROC - a.ROC)

    // Assign ranks and calculate Greenblatt's value
    companies = companies.map((company) => {
      const earningYieldRank = sortedByEarningYield.findIndex((c) => c._id.toString() === company._id.toString()) + 1
      const ROCRank = sortedByROC.findIndex((c) => c._id.toString() === company._id.toString()) + 1
      const greenBlattsValue = earningYieldRank + ROCRank

      return {
        ...company,
        earningYieldRank,
        ROCRank,
        greenBlattsValue,
      }
    })

    // Sort by Greenblatt's value (ascending order)
    companies.sort((a, b) => a.greenBlattsValue - b.greenBlattsValue)

    res.json(companies)
  } catch (error) {
    console.error("Error fetching companies:", error)
    res.status(500).json({ error: `An error occurred while fetching companies: ${error.message}` })
  }
})
app.delete("/api/companies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCompany = await Company.findByIdAndDelete(id);
    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: `An error occurred while deleting the company: ${error.message}` });
  }
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

