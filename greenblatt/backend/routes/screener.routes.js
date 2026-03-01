// routes/screener.routes.js

const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")
const screenerController = require("../controllers/screener.controller")

router.use(authMiddleware)

router.get("/:symbol", screenerController.getScreenerAnalysis)

module.exports = router