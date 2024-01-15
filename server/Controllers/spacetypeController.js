const SpaceType = require('../models/spacetype');

// Create a new SpaceType
const createSpaceType = async (req, res) => {
  try {
    const spaceType = await SpaceType.create(req.body);
    return res.status(201).json(spaceType);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all SpaceTypes
const getAllSpaceTypes = async (req, res) => {
  try {
    const spaceTypes = await SpaceType.findAll();
    return res.status(200).json(spaceTypes);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific SpaceType by ID
const getSpaceTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const spaceType = await SpaceType.findByPk(id);
    if (!spaceType) {
      return res.status(404).json({ error: 'SpaceType not found' });
    }
    return res.status(200).json(spaceType);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a SpaceType by ID
const updateSpaceType = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRows] = await SpaceType.update(req.body, {
      where: { id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'SpaceType not found' });
    }
    const updatedSpaceType = await SpaceType.findByPk(id);
    return res.status(200).json(updatedSpaceType);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a SpaceType by ID
const deleteSpaceType = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRowCount = await SpaceType.destroy({
      where: { id },
    });
    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'SpaceType not found' });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createSpaceType,
  getAllSpaceTypes,
  getSpaceTypeById,
  updateSpaceType,
  deleteSpaceType,
};
