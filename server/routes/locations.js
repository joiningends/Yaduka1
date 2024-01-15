// Import necessary modules
const express = require('express');
const router = express.Router();
const locationcontroller = require('../Controllers/locationController');

// Create location with details
router.post('/:id', locationcontroller.createLocationWithDetails);

// Get under information by user ID
router.get('/under/:id', locationcontroller.getAllLocationsWithDetails);

// Export the router
module.exports = router;
