const Quality = require("../models/quality");
const varient = require("../models/varient");
const Varient = require("../models/varient");

//get all size Data

const allQuality = async (req, res) => {
  try {
    const data = await Quality.findAll({
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

const createQuality = async (req, res) => {
  const { quality, varientId } = req.body;

  try {
    const newQuality = await Quality.create({
      quality: quality,
      varientId: varientId,
    });

    res.status(201).json(newQuality);
  } catch (error) {
    res.status(500).json(error);
  }
};


//get single commodity

const singleQuality = async (req, res) => {
  const qualityId = req.params.id;
  try {
    const findQuality = await Quality.findOne({
      where: {
        id: qualityId,
      },
    });
    if (findQuality) {
      res.status(200).json(findQuality);
    } else {
      res.status(404).json(" Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update size Data

const updateQuality = async (req, res) => {
  const qualityId = req.params.id;
  const { quality, varientId } = req.body;
  try {
    const findQuality = await Quality.findOne({
      where: {
        id: qualityId,
      },
    });
    if (findQuality) {
      const newQuality = await findQuality.update({
        quality: quality,
        varientId: varientId,
      });
      res.status(200).json(newQuality);
    } else {
      res.status(404).json({ message: " Not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete quality
const deleteQuality = async (req, res) => {
  const qualityId = req.params.id;
  try {
    const quality = await Quality.findOne({
      where: {
        id: qualityId,
      },
    });
    if (quality) {
      await quality.destroy();
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: " not found..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const qualityToVarient = async(req,res)=>{
  try {
    const { varientId } = req.params;
    const qualities = await Quality.findAll({
      where: { varientId: varientId },
    });
    res.json(qualities);
  } catch (error) {
    console.error("Error fetching qualities by variant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createQuality,
  
  allQuality,
  singleQuality,
  updateQuality,
  deleteQuality,
  qualityToVarient
};
