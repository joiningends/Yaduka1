const Unit = require("../models/unit");

// create Unit
const createUnit = async (req, res) => {
  const { unit } = req.body;
  try {
    const newUnit = await Unit.create({ unit: unit });
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all unit
const getAllUnit = async (req, res) => {
  try {
    const units = await Unit.findAll();
    if (!units) {
      res.status(404).json("Not Found");
    }
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json(error);
  }
};

//get single unit
const singleUnit = async (req, res) => {
  const unitId = req.params.id;
  try {
    const unit = await Unit.findOne({
      where: {
        id: unitId,
      },
    });
    if (unit) {
      res.status(200).json(unit);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// update unit
const updateunit = async (req, res) => {
  const unitId = req.params.id;
  const { unit } = req.body;
  try {
    const findUnit = await Unit.findOne({
      where: {
        id: unitId,
      },
    });
    if (findUnit) {
      const newUnit = await findUnit.update({
        unit: unit,
      });
      res.status(200).json(newUnit);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete unit
const deleteUnit = async (req, res) => {
  const unitId = req.params.id;
  try {
    const unit = await Unit.findOne({
      where: {
        id: unitId,
      },
    });
    if (unit) {
      await unit.destroy();
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: " not found..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createUnit,
  getAllUnit,
  singleUnit,
  updateunit,
  deleteUnit
};
