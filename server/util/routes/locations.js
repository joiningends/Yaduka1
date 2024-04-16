// Import necessary modules
const express = require('express');
const router = express.Router();
const locationcontroller = require('../Controllers/locationController');

// Create location with details
router.post('/:id', locationcontroller.createLocationWithDetails);

// Get under information by user ID
router.get('/under/:id', locationcontroller.getAllLocationsWithDetails);
router.get('/:id', locationcontroller.getAllLocations);
router.get('/space/:id', locationcontroller.getSpaceDetailsByLocationId);
router.delete('/:id', locationcontroller.deleteLocationById);
// Export the router
module.exports = router;
