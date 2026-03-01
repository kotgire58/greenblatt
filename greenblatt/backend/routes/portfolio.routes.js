const express = require("express")
const router = express.Router()
const multer = require("multer")

const portfolioController = require("../controllers/portfolio.controller")
const authMiddleware = require("../middleware/auth.middleware")

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.use(authMiddleware)

// Create portfolio
router.post("/", portfolioController.createPortfolio)

// Get user portfolios
router.get("/", portfolioController.getUserPortfolios)

// Upload CSV to specific portfolio
router.post(
  "/:portfolioId/upload-csv",
  upload.single("file"),
  portfolioController.uploadCSV
)

// Upload image to specific portfolio
router.post(
  "/:portfolioId/upload-image",
  upload.single("file"),
  portfolioController.uploadImage
)

// Get holdings of a portfolio
router.get("/:portfolioId", portfolioController.getPortfolio)

// Delete holding from portfolio
router.delete("/:portfolioId/:holdingId", portfolioController.deleteHolding)

router.get(
  "/:portfolioId/greenblatt",
  portfolioController.getGreenblattRanking
)
router.post("/:portfolioId/add", portfolioController.addHolding)

module.exports = router