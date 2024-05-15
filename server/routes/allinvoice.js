const express = require('express');
const router = express.Router();
const companyController = require('../Controllers/invoicedeController');

router.post('/company', companyController.createCompany);

// Route for creating a new signature
router.post('/signature', companyController.createSignature);
router.post('/', companyController.createBankDetail);


router.get('/addresses', companyController.getAllAddresses);

// Route for fetching all bank details
router.get('/bankdetails', companyController.getAllBankDetails);

// Route for fetching all signatures
router.get('/signatures', companyController.getAllSignatures);

module.exports = router;


module.exports = router;
