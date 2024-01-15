const commodityTypes = require("../models/commodityType");
//get all commodity Type

const getCommodityTypes = async (req, res) => {
  try {
    const data = await commodityTypes.findAll();
    if (!data) {
      res.status(404).json({ message: "Not found.." });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

// create commodity Types

const createCommodityTypes = async (req, res) => {
  const { commodityType } = req.body;

  try {
    const newCommodityType = await commodityTypes.create({
      commodityType: commodityType,
    });

    res.status(201).json(newCommodityType);
  } catch (error) {
    res.status(500).json(error);
  }
};

//single commodity Type

const singleCommodityType = async (req, res) => {
  const commodityTypeId = req.params.id;
  try {
    const findCommodityType = await commodityTypes.findOne({
      where: {
        id: commodityTypeId,
      },
    });
    if (findCommodityType) {
      res.status(200).json(findCommodityType);
    } else {
      res.status(404).json(" Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// update commodity Type

const updateCommodityType = async (req, res) => {
  const commodityTypeId = req.params.id;
  const { commodityType } = req.body;
  try {
    const findCommodityType = await commodityTypes.findOne({
      where: {
        id: commodityTypeId,
      },
    });
    if (findCommodityType) {
      const newCommodityType = await findCommodityType.update({
        commodityType: commodityType,
      });
      res.status(200).json(newCommodityType);
    } else {
      res.status(404).json({ message: " Not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete commodityType

const deleteCommodityType = async (req, res) => {
  const typeId = req.params.id;
  try {
    const commodityType = await commodityTypes.findOne({
      where: {
        id: typeId,
      },
    });
    if (commodityType) {
      await commodityType.destroy();
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: "user not found..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getCommodityTypes,
  createCommodityTypes,
  deleteCommodityType,
  singleCommodityType,
  updateCommodityType
};
