// models/Company.js
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  EBIT: { type: Number, required: true },
  enterpriseValue: { type: Number }, // optional: if missing, we will compute it
  marketCap: { type: Number },
  debt: { type: Number },
  cash: { type: Number },
  netFixedAssets: { type: Number },
  netWorkingCapital: { type: Number }
});

module.exports = mongoose.model('Company', CompanySchema);
