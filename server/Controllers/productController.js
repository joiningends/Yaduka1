const Product = require("../models/product");
const Varient = require("../models/varient");
const Quality = require("../models/quality");
const Size = require("../models/size");
const Unit = require("../models/unit");
const Commodity = require("../models/commodity");

//get all product Data

const allProduct = async (req, res) => {
  try {
    const data = await Product.findAll({
      // where: { isActive: true },
      include: [
        {
          model: Varient,
        },
        {
          model: Quality,
        },
        {
          model: Size,
        },
        {
          model: Unit,
        },
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

const allProduct1 = async (req, res) => {
  const commodityId = req.params.commodityId;
  console.log(commodityId);
  try {
    const data = await Product.findAll({
      where: { commodityId: commodityId },
      include: [
        {
          model: Varient,
          include: [
            {
              model: Commodity,
            },
          ],
        },
      ],
    });
    console.log(data);

    if (!data || data.length === 0) {
      res.status(404).json({ message: "Not found.." });
      return;
    }
    // Extract unique variants
    const uniqueVariants = Object.values(
      data.reduce((acc, product) => {
        acc[product.varient.id] = acc[product.varient.id] || product.varient;
        return acc;
      }, {})
    );

    res.status(200).json(uniqueVariants);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createProduct = async (req, res) => {
  const {
    commodityId,
    variantId,
    qualityId,
    sizeId,
    packagingType,
    packSize,
    quantifiedBy,
    unit,
    length,
    height,
    width,
  } = req.body;
  console.log(req.body);

  try {
    let image = null;
    if (req.file) {
      const fileName = req.file.key; // Use the key provided by S3 instead of filename
      const basePath = `https://yasukaimages.s3.ap-south-1.amazonaws.com/`; // Base URL of your S3 bucket
      image = `${basePath}${fileName}`;
    }

    // Create the product with the received data
    const newProduct = await Product.create({
      commodityId,
      variantId,
      qualityId,
      sizeId,
      packagingType,
      packSize,
      quantifiedBy,
      unit,
      length,
      height,
      width,
      image,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

//get single product

const singleProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const findProduct = await Product.findOne({
      where: {
        id: productId,
      },
    });
    if (findProduct) {
      res.status(200).json(findProduct);
    } else {
      res.status(404).json(" Not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//update product Data

const updateProduuct = async (req, res) => {
  const productId = req.params.id;
  const {
    packSize,
    varientId,
    qualityId,
    sizeId,
    unitId,
    commodityId,
    quantifiedBy,
    newUnit,
  } = req.body;
  try {
    const findProduct = await Product.findOne({
      where: {
        id: productId,
      },
    });
    if (findProduct) {
      const newProduct = await findProduct.update({
        packSize: packSize,
        varientId: varientId,
        qualityId: qualityId,
        sizeId: sizeId,
        unitId: unitId,
        commodityId: commodityId,
        quantifiedBy: quantifiedBy,
        newUnit: newUnit,
      });
      res.status(200).json(newProduct);
    } else {
      res.status(404).json({ message: " Not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findOne({
      where: {
        id: productId,
      },
    });
    if (product) {
      await product.destroy();
      res.status(200).json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: " not found..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const allProductvariant = async (req, res) => {
  const varientId = req.params.VarientId;
  try {
    const data = await Product.findAll({
      where: { varientId: varientId },
      include: [
        {
          model: Varient,
        },
        {
          model: Quality,
        },
        {
          model: Size,
        },
        {
          model: Unit,
        },
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

module.exports = {
  createProduct,
  allProduct,
  allProduct1,
  singleProduct,
  updateProduuct,
  deleteProduct,
  allProductvariant,
};
