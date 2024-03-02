const express = require('express');
const router = express.Router();
const GstRateController = require('../Controllers/gstrateController');

// POST request to create a new GstRate
router.post('/', GstRateController.createGstRate);

// GET request to retrieve all GstRate entries
router.get('/', GstRateController.getAllGstRates);

module.exports = router;
