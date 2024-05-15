const Commodity = require("../models/commodity");
const commodityType = require("../models/commodityType");
const Product = require("../models/product");
//get all commodity Type

const allcommodity = async (req, res) => {
  try {
    const data = await Commodity.findAll({
      where: { isActive: true },
      include: [
        {
          model: commodityType,
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

const allcommodity1 = async (req, res) => {
  try {
    const data = await Commodity.findAll({
      where: { isActive: true },
      include: [
        {
          model: commodityType,
        },
      ],
    });
    if (!data) {
      res.status(404).json({ message: "Not found.." });
    } else {
      let i = data.length;
      let j = 0;
      let itemAdded = [];

      for (let index = 0; index < data.length; index++) {
        const element = data[index];

        Product.findOne({ where: { commodityId: element.id } }).then(pro => {
          if (!pro) {
            j++;
            if (i == j) {
              res.status(200).json(itemAdded);
            }
          } else {
            itemAdded.push(element);
            j++;
            if (i == j) {
              res.status(200).json(itemAdded);
            }
          }
        });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// create commodity Types

const createCommodity = async (req, res) => {
  const { commodity, commodityTypeId } = req.body;

  try {
    let image = null;
    if (req.file) {
      const fileName = req.file.key; // Use the key provided by S3 instead of filename
      const basePath = `https://yasukaimages.s3.ap-south-1.amazonaws.com/`; // Base URL of your S3 bucket
      image = `${basePath}${fileName}`;
    }
    console.log(req.file);
    const newCommodity = await Commodity.create({
      commodity: commodity,
      image: image,
      commodityTypeId: commodityTypeId,
    });

    res.status(201).json(newCommodity);
  } catch (error) {
    res.status(500).json(error);
  }
};

//get single commodity

const singleCommodity = async (req, res) => {
  const commodityId = req.params.id;
  try {
    const commodity = await Commodity.findOne({
      where: {
        id: commodityId,
      },
    });
    if (commodity) {
      res.status(200).json(commodity);
    } else {
      res.status(404).json("Employee not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update commodity

const updateCommodity = async (req, res) => {
  const commodityId = req.params.id;
  const { commodity, commodityTypeId, isActive } = req.body;
  try {
    const commodityInstance = await Commodity.findOne({
      where: {
        id: commodityId,
      },
    });

    if (commodityInstance) {
      let image = commodityInstance.image;
      if (req.file) {
        const fileName = req.file.key; // Use the key provided by S3 instead of filename
        const basePath = `https://yasukaimages.s3.ap-south-1.amazonaws.com/`; // Base URL of your S3 bucket
        image = `${basePath}${fileName}`;
      }
      console.log(req.file);

      await commodityInstance.update({
        commodity: commodity,
        commodityTypeId: commodityTypeId,
        image: image,
        isActive:
          isActive !== undefined ? isActive : commodityInstance.isActive,
      });

      res.json(commodityInstance);
    } else {
      res.status(404).json({ message: "Commodity not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = updateCommodity;

// delete commodityType

const deleteCommodity = async (req, res) => {
  const commodityId = req.params.id;
  try {
    const commodity = await Commodity.findOne({
      where: {
        id: commodityId,
      },
    });
    if (commodity) {
      commodity.isActive = false;
      await commodity.save();
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: "user not found..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//download files
const downloadFiles = (req, res) => {
  const fileName = req.params.name;
  const path = __basedir + "/wwwroot/commodity/";

  res.download(path + fileName, err => {
    if (err) {
      res.status(500).send({
        message: "File can not be downloaded: " + err,
      });
    }
  });
};

module.exports = {
  createCommodity,
  allcommodity,
  allcommodity1,
  deleteCommodity,
  updateCommodity,
  singleCommodity,
  downloadFiles,
  // uploadImage,
};
