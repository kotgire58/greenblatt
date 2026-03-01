const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const companyRoutes = require("./routes/company.routes")
const portfolioRoutes = require("./routes/portfolio.routes")
const buffettRoutes = require("./routes/buffett.routes")
const authRoutes = require("./routes/auth.routes")
const screenerRoutes = require("./routes/screener.routes")


const errorHandler = require("./middleware/error.middleware")

const app = express()

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://greenblatt-1.onrender.com"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Body parser FIRST
app.use(express.json())
app.use("/api/auth", authRoutes)

// Rate limiting
app.use(
  rateLimit({
    windowMs: 60 * 1000,
max: process.env.NODE_ENV === "production" ? 60 : 500  })
)

// Routes
app.use("/api/companies", companyRoutes)
app.use("/api/portfolio", portfolioRoutes)
app.use("/api/buffett", buffettRoutes)
app.use("/api/screener", screenerRoutes)

// Error handler LAST
app.use(errorHandler)

module.exports = app