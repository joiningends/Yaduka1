const Varient = require("../models/varient");
const Commodity = require("../models/commodity");

//get all varient

const allVarient = async (req, res) => {
  try {
    const data = await Varient.findAll({
      where: { isActive: true },
      include: [
        {
          model: Commodity,
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

const commodityVarient = async (req, res) => {
  const commodityId = req.params.commodityId;
  try {
    const data = await Varient.findAll({
      where: { isActive: true, commodityId: commodityId },
      include: [
        {
          model: Commodity,
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

// create varient

const createVarient = async (req, res) => {
  const { varient, commodityId, cropDuration, isImported, farmable } = req.body;

  try {
    let image = null;
    if (req.file) {
      const fileName = req.file.key; // Use the key provided by S3 instead of filename
      const basePath = `https://yasukaimages.s3.ap-south-1.amazonaws.com/`; // Base URL of your S3 bucket
      image = `${basePath}${fileName}`;
    }
    console.log(req.file);
    const newVarient = await Varient.create({
      varient: varient,
      commodityId: commodityId,
      image: image,
      cropDuration: cropDuration,
      isImported: isImported,
      farmable: farmable,
    });

    res.status(201).json(newVarient);
  } catch (error) {
    res.status(500).json(error);
  }
};

//get single varient

const singleVarient = async (req, res) => {
  const varientId = req.params.id;
  try {
    const varient = await Varient.findOne({
      where: {
        id: varientId,
      },
    });
    if (varient) {
      res.status(200).json(varient);
    } else {
      res.status(404).json("Varient not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update varient

const updateVarient = async (req, res) => {
  const varientId = req.params.id;
  const { varient, commodityId, cropDuration, isImported, farmable } = req.body;
  try {
    const updateVarients = await Varient.findOne({
      where: {
        id: varientId,
      },
    });
    if (updateVarients) {
      let image = updateVarients.image;
      if (req.file) {
        const fileName = req.file.key; // Use the key provided by S3 instead of filename
        const basePath = `https://yasukaimages.s3.ap-south-1.amazonaws.com/`; // Base URL of your S3 bucket
        image = `${basePath}${fileName}`;
      }
      console.log(req.file);
      await updateVarients.update({
        varient: varient,
        commodityId: commodityId,
        image: image,
        cropDuration: cropDuration,
        isImported: isImported,
        farmable: farmable,
      });
      res.json(updateVarients);
    } else {
      res.status(404).json({ message: "varient not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete varient

const deleteVarient = async (req, res) => {
  const varientId = req.params.id;
  try {
    const varient = await Varient.findOne({
      where: {
        id: varientId,
      },
    });
    if (varient) {
      varient.isActive = false;
      await varient.save();
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: "varient not found..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//download files
const downloadFiles = (req, res) => {
  const fileName = req.params.name;
  const path = __basedir + "/wwwroot/varient/";

  res.download(path + fileName, err => {
    if (err) {
      res.status(500).send({
        message: "File can not be downloaded: " + err,
      });
    }
  });
};

const getCommodityToVarient = async (req, res) => {
  try {
    const { commodityId } = req.params;
    const variants = await Varient.findAll({
      where: { commodityId: commodityId },
    });
    res.json(variants);
  } catch (error) {
    console.error("Error fetching variants by commodity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  allVarient,
  commodityVarient,
  createVarient,
  singleVarient,
  updateVarient,
  deleteVarient,
  downloadFiles,
  getCommodityToVarient,
};
