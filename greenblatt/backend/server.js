const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Company = require('./models/Company');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/Stock';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.post('/api/companies', async (req, res) => {
    try {
      const companyData = req.body;
      const newCompany = new Company(companyData);
      const savedCompany = await newCompany.save();
      res.json(savedCompany);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // GET endpoint to retrieve companies with computed columns and rankings
  app.get('/api/companies', async (req, res) => {
    try {
      // Fetch companies from the database
      let companies = await Company.find();
  
      // Compute Earning Yield and ROC for each company.
      companies = companies.map(c => {
        const EBIT = c.EBIT || 0;
        
        // Calculate enterprise value: use provided value or compute as (marketCap + debt - cash)
        let enterpriseValue = c.enterpriseValue;
        if (enterpriseValue == null) { 
          enterpriseValue = (c.marketCap || 0) + (c.debt || 0) - (c.cash || 0);
        }
        const earningYield = enterpriseValue !== 0 ? EBIT / enterpriseValue : 0;
        
        // Calculate ROC = EBIT / (net fixed assets + net working capital)
        const denominator = (c.netFixedAssets || 0) + (c.netWorkingCapital || 0);
        const ROC = denominator !== 0 ? EBIT / denominator : 0;
        
        return {
          ...c._doc, // include all original fields
          computedEnterpriseValue: enterpriseValue,
          earningYield,
          ROC
        };
      });
  
      // Rank companies based on earningYield (higher is better)
      let sortedByEarningYield = [...companies].sort((a, b) => b.earningYield - a.earningYield);
      sortedByEarningYield.forEach((company, index) => {
        company.earningYieldRank = index + 1;
      });
  
      // Rank companies based on ROC (higher is better)
      let sortedByROC = [...companies].sort((a, b) => b.ROC - a.ROC);
      sortedByROC.forEach((company, index) => {
        company.ROCRank = index + 1;
      });
  
      // Combine the ranking info for each company
      companies = companies.map(c => {
        // Find the ranking info from the sorted arrays (matching by id)
        const eyRank = sortedByEarningYield.find(comp => comp._id.toString() === c._id.toString()).earningYieldRank;
        const rocRank = sortedByROC.find(comp => comp._id.toString() === c._id.toString()).ROCRank;
        return {
          ...c,
          earningYieldRank: eyRank,
          ROCRank: rocRank,
          greenBlattsValue: eyRank + rocRank  // Sum of both ranks
        };
      });
  
      // Optionally sort by greenBlattsValue (lowest sum is best)
      companies.sort((a, b) => a.greenBlattsValue - b.greenBlattsValue);
  
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));