const GstType = require("../models/gsttype");

// POST request to create a new GstType
const createGstType = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if GstType with the same name already exists
    const existingGstType = await GstType.findOne({ where: { name } });

    if (existingGstType) {
      return res.status(400).json({ error: "GstType with this name already exists" });
    }

    // Create a new GstType using the GstType model
    const newGstType = await GstType.create({ name });

    res.status(201).json(newGstType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET request to retrieve all GstTypes
const getAllGstTypes = async (req, res) => {
  try {
    const gstTypes = await GstType.findAll();

    res.status(200).json(gstTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createGstType,
  getAllGstTypes,
};
