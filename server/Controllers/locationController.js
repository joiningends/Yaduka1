const  Location  = require('../models/location');
const  SpaceDetails = require('../models/SpaceDetails');
const userTable = require("../models/user");
const createLocationWithDetails = async (req, res) => {
  try {
    const { storagename, address, spacedetails } = req.body;
    const userId = req.params.id;

    // Find user by ID
    const user = await userTable.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let under = null;

    if (user.userTypeId === 3) {
      // If user type ID is 3, set under to the user ID
      under = userId;
    } else if (user.userTypeId === 5) {
      // If user type ID is 5, set under to the user's under value
      under = user.under;
    }
console.log(under)
    // Create the location with the associated under value
    const location = await Location.create({ storagename, address, under });

    // Create the space details associated with the location
    await Promise.all(
      spacedetails.map(async (detail) => {
        await SpaceDetails.create({
          ...detail,
          locationId: location.id,
        });
      })
    );

    res.status(201).json({ message: 'Location created successfully' });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getAllLocationsWithDetails = async (req, res) => {
  try {
    // Fetch all locations with associated space details
    const locations = await Location.findAll({
      include: [{
        model: SpaceDetails,
        as: 'spaceDetails',
      }],
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by ID
    const user = await userTable.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let underofuser = null;

    if (user.userTypeId === 3) {
      // If user type ID is 3, set under to the user ID
      underofuser = userId;
    } else if (user.userTypeId === 5) {
      // If user type ID is 5, set under to the user's under value
      underofuser = user.under;
    }
    const locations = await Location.findAll({
      where: { under: underofuser },
      include: [{
        model: SpaceDetails,
        as: 'spaceDetails',
      }],
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getSpaceDetailsByLocationId = async (req, res) => {
  try {
    const locationId = req.params.id; // Assuming the locationId is part of the route

    const spaceDetails = await SpaceDetails.findAll({
      where: {
        locationId: locationId,
      },
    });

    res.status(200).json(spaceDetails);
  } catch (error) {
    console.error("Error fetching space details by location ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteLocationById = async (req, res) => {
  try {
    const locationId = req.params.id;

    // Check if the location exists
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Delete associated space details
    await SpaceDetails.destroy({ where: { locationId } });

    // Delete the location
    await Location.destroy({ where: { id: locationId } });

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createLocationWithDetails,
  getAllLocationsWithDetails,
  getAllLocations,
  getSpaceDetailsByLocationId,
  deleteLocationById,
};