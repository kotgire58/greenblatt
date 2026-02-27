const express = require("express")
const router = express.Router()
const buffettController = require("../controllers/buffett.controller")

router.get("/:symbol", buffettController.getBuffettAnalysis)

module.exports = router