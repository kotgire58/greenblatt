const express = require("express")
const router = express.Router()
const controller = require("../controllers/company.controller")

router.get("/:symbol", controller.getCompany)
router.get("/", controller.getAllCompanies)

module.exports = router