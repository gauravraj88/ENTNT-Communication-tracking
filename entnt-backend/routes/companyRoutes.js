const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.get("/", companyController.getAllCompanies);
router.post("/add", companyController.addCompany);
router.put("/edit/:id", companyController.updateCompany);
router.delete("/delete/:id", companyController.deleteCompany);

module.exports = router;