const express = require("express")
const router = express.Router()
const multer = require("multer")
const portfolioController = require("../controllers/portfolio.controller")

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.post("/upload-csv", upload.single("file"), portfolioController.uploadCSV)
router.post("/upload-image", upload.single("file"), portfolioController.uploadImage)

router.get("/", portfolioController.getPortfolio)
router.delete("/:id", portfolioController.deleteHolding)

module.exports = router