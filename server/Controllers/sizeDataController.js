const Size = require("../models/size");
const Varient = require("../models/varient");

//get all size Data

const allSizeData = async (req, res) => {
  try {
    const data = await Size.findAll({
      // where: { isActive: true },
      include: [
        {
          model: Varient,
        },
      ],
    });
    if (!data) {
      res.status(404).json({ message: "Not found.." });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

// create size data

const createSizeData = async (req, res) => {
  const { size, varientId } = req.body;

  try {
    const newSizeData = await Size.create({
      size: size,
      varientId: varientId,
    });

    res.status(201).json(newSizeData);
  } catch (error) {
    res.status(500).json(error);
  }
};


//get single commodity

const singleSizeData = async (req, res) => {
  const sizeId = req.params.id;
  try {
    const findSizeData = await Size.findOne({
      where: {
        id: sizeId,
      },
    });
    if (findSizeData) {
      res.status(200).json(findSizeData);
    } else {
      res.status(404).json(" Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update size Data

const updateSizeData = async (req, res) => {
  const sizeId = req.params.id;
  const { size, varientId } = req.body;
  try {
    const findSizeData = await Size.findOne({
      where: {
        id: sizeId,
      },
    });
    if (findSizeData) {
      const newSizeData = await findSizeData.update({
        size: size,
        varientId: varientId,
      });
      res.status(200).json(newSizeData);
    } else {
      res.status(404).json({ message: " Not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete size
const deleteSize = async (req, res) => {
  const sizeId = req.params.id;
  try {
    const size = await Size.findOne({
      where: {
        id: sizeId,
      },
    });
    if (size) {
      await size.destroy();
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: " not found..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


const getSizeToVarient = async(req,res)=>{
  try {
    const { varientId } = req.params;
    const sizes = await Size.findAll({
      where: { varientId: varientId },
    });
    res.json(sizes);
  } catch (error) {
    console.error("Error fetching sizes by variant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createSizeData,
  allSizeData,
  singleSizeData,
  updateSizeData,
  deleteSize,
  getSizeToVarient
};
