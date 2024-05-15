const Location = require("../models/location");
const SpaceDetails = require("../models/SpaceDetails");
const userTable = require("../models/user");
const createLocationWithDetails = async (req, res) => {
  try {
    const { storagename, address, spacedetails, rantable } = req.body;
    const userId = req.params.id;

    // Find user by ID
    const user = await userTable.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let under = null;

    if (user.userTypeId === 3) {
      // If user type ID is 3, set under to the user ID
      under = userId;
    } else if (user.userTypeId === 5) {
      // If user type ID is 5, set under to the user's under value
      under = user.under;
    }
    console.log(under);
    // Create the location with the associated under value
    const location = await Location.create({
      storagename,
      address,
      under,
      rantable,
    });

    // Create the space details associated with the location
    await Promise.all(
      spacedetails.map(async detail => {
        await SpaceDetails.create({
          ...detail,
          locationId: location.id,
        });
      })
    );

    res.status(201).json({ message: "Location created successfully" });
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllLocationsWithDetails = async (req, res) => {
  try {
    // Fetch all locations with associated space details
    const locations = await Location.findAll({
      where: { isActive: true },
      include: [
        {
          model: SpaceDetails,
          as: "spaceDetails",
        },
      ],
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by ID
    const user = await userTable.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
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
      where: { under: underofuser, isActive: true },
      include: [
        {
          model: SpaceDetails,
          as: "spaceDetails",
        },
      ],
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
    // Extract the location ID from the request parameters
    const locationId = req.params.id;

    // Check if the location exists in the database
    const location = await Location.findByPk(locationId);
    if (!location) {
      // If location does not exist, return 404 with an error message
      return res.status(404).json({ error: "Location not found" });
    }

    // If location exists, mark it as inactive
    location.isActive = false;

    // Save the changes to the database
    await location.save();

    // Send a success response
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    // If an error occurs, log the error and send a 500 response
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getByLocationId = async (req, res) => {
  try {
    const locationId = req.params.id; // Assuming the locationId is part of the route

    const locations = await Location.findOne({
      where: { id: locationId },
      include: [
        {
          model: SpaceDetails,
          as: "spaceDetails",
        },
      ],
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching space details by location ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateLocationWithDetails = async (req, res) => {
  try {
    const locationId = req.params.id; // Assuming locationId is part of the route
    const { storagename, address, spacedetails, rantable } = req.body;

    // Find the location by ID
    const location = await Location.findByPk(locationId);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Update location details
    await location.update({
      storagename,
      address,
      rantable,
    });

    await Promise.all(
      spacedetails.map(async detail => {
        await SpaceDetails.create({
          ...detail,
          locationId: locationId,
        });
      })
    );

    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createLocationWithDetails,
  getAllLocationsWithDetails,
  getAllLocations,
  getSpaceDetailsByLocationId,
  deleteLocationById,
  getByLocationId,
  updateLocationWithDetails,
};
