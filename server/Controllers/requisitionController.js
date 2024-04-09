// controllers/requisitionController.js
const Requisition = require("../models/requisition");
const Contract = require("../models/contract");
const userTable = require("../models/user");

const Product = require("../models/product");

const ContractProduct = require("../models/contractproduct");
const { Op } = require("sequelize");

const Variant = require("../models/varient");
const Quality = require("../models/quality");
const Size = require("../models/size");
const Unit = require("../models/unit");
const Commodity = require("../models/commodity");
const Sequelize = require("sequelize");
const SpaceDetails = require("../models/SpaceDetails");
const Location = require("../models/location");
const Reproduct = require("../models/reproduct");
const Storagespace = require("../models/storagespace");

const sequelize = require("../util/database");

exports.getRequisitionsByPartyId = async (req, res) => {
  try {
    const partyid = req.params.partyid;
    const user = await userTable.findByPk(partyid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let under = null;

    if (user.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      under = partyid;
    } else if (user.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      under = user.under;
    }

    const requisitions = await Requisition.findAll({
      where: {
        partyid: under,
        status: "pending",
      },
    });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequisitionsByPartycompleted = async (req, res) => {
  try {
    const partyid = req.params.partyid;
    const user = await userTable.findByPk(partyid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let under = null;

    if (user.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      under = partyid;
    } else if (user.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      under = user.under;
    }

    const requisitions = await Requisition.findAll({
      where: {
        partyid: under,
        status: "Completed",
      },
    });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getRequisitionById = async (req, res) => {
  try {
    const requisitionId = req.params.requisitionId;

    const requisition = await Reproduct.findAll({
      where: {
        requationId: requisitionId,
      },

      include: [
        {
          model: ContractProduct,
          as: "contractproduct",

          include: [
            {
              model: Product,
              as: "product",
              include: [
                {
                  model: Variant,
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
            },
            {
              model: Contract,
              as: "space", // Assuming this is the correct alias for the Contract model
            },
          ],
        },
      ],
    });

    if (!requisition) {
      return res.status(404).json({ error: "Requisition not found" });
    }

    const productMap = new Map();

    requisition.forEach(contractProduct => {
      const productName = contractProduct.contractproduct.productid;
      const productDetails = {
        contractProductId: contractProduct.contractproductid,
        variant: contractProduct.contractproduct.product.varient?.varient,
        quality: contractProduct.contractproduct.product.quality?.quality,
        size: contractProduct.contractproduct.product.size?.size,
        unit: contractProduct.contractproduct.product.unit?.unit,
        commodity: contractProduct.contractproduct.product.commodity?.commodity,
      };

      const qty = contractProduct.requireqty; // Assuming 'requireqty' is the field representing quantity
      if (productMap.has(productName)) {
        productMap.get(productName).qty += qty;
      } else {
        productMap.set(productName, { qty, ...productDetails });
      }
    });

    // Create an array of objects with summed quantities and product details
    const result = [];
    productMap.forEach((product, productName) => {
      result.push({ productName, ...product });
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequisitionId = async (req, res) => {
  try {
    const userId = req.params.id;
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

    const requisitions = await Requisition.findAll({
      where: {
        status: "pending",
        underValues: under,
      },
      include: [
        {
          model: Location,
          as: "locatio",
          attributes: ["id", "storagename"],
        },
      ],
    });

    // Extracting unique locations
    const uniqueLocations = [];
    const seenIds = new Set();
    requisitions.forEach(requisition => {
      const locationId = requisition.locatio.id;
      if (!seenIds.has(locationId)) {
        seenIds.add(locationId);
        uniqueLocations.push({
          id: requisition.locatio.id,
          storagename: requisition.locatio.storagename,
        });
      }
    });

    res.json(uniqueLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequisitionIdcompleted = async (req, res) => {
  try {
    const userId = req.params.id;
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
    const requisitions = await Requisition.findAll({
      where: {
        status: "Completed",
        // Assuming there's a field named 'under' in your Requisition model
        underValues: under,
      },
      include: [
        {
          model: Contract,
          as: "conf",
          attributes: ["id", "contractstartdate", "slno"],
          include: [
            { model: Location, as: "location", attributes: ["storagename"] },
          ],
        },
        {
          model: userTable,
          as: "part",
          attributes: ["name"],
        },
      ],
    });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateDeliveryQty = async (req, res) => {
  try {
    const deliveryDataArray = req.body; // Assuming the array of data is in the request body
    let success = true;
    let updatedReproduct = null; // Initialize to null

    // Loop through the array and update each record
    for (const deliveryData of deliveryDataArray) {
      const { id, deliveryQty } = deliveryData;

      // Update the record in the database
      await Reproduct.update(
        { deliveryQty: deliveryQty },
        { where: { id: id } }
      );

      // Manually fetch the updated row
      const updatedRow = await Reproduct.findOne({ where: { id: id } });

      // Check if the update was successful
      if (!updatedRow) {
        success = false;
        break;
      }

      // Set the value of updatedReproduct for the last successful update
      updatedReproduct = updatedRow;

      // Assuming 'contractproductid' and 'requationId' are column names in your Reproduct table
      const { contractproductid } = updatedReproduct;

      // Subtract delivered quantity from contract product quantity
      await ContractProduct.decrement("qty", {
        by: deliveryQty,
        where: { id: contractproductid },
      });
    }

    // If all updates were successful, update the status to 'Completed' for corresponding requationId
    if (updatedReproduct !== null) {
      const { requationId } = updatedReproduct;

      await Requisition.update(
        { status: "Completed" },
        {
          where: {
            id: requationId,
          },
        }
      );

      res.json({ message: "Delivery quantities updated successfully" });
    } else {
      res.status(500).json({ error: "Failed to update delivery quantities" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createRequisition = async (req, res) => {
  try {
    // Extract data from the request body
    const { date, underValues, storageId, requisitionDetails } = req.body;
    const partyId = req.params.partyid;

    const user = await userTable.findByPk(partyId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a single requisition
    const newRequisition = await Requisition.create({
      date,
      status: "pending",
      partyid: user.userTypeId === 4 ? partyId : user.under,
      underValues: underValues,
      storageId,
    });

    // Update user's requisition count
    user.reqsitioncount = user.reqsitioncount + 1;
    await user.save();

    // Generate requisition serial number
    const currentYear = new Date().getFullYear();
    const slno = `RQ/${newRequisition.id}/${currentYear}/${user.reqsitioncount}`;
    newRequisition.slno = slno;
    await newRequisition.save();

    // Create products associated with the requisition if product details are provided
    if (requisitionDetails && requisitionDetails.length > 0) {
      const products = await Reproduct.bulkCreate(
        requisitionDetails.flatMap(detail =>
          detail.productdetails.map(product => ({
            requireqty: product.requireqty,
            deliveryQty: product.deliveryQty,
            contractproductid: product.contractproductid,
            contractId: product.contractId,
            storageId: product.storageId,
            requationId: newRequisition.id,
          }))
        )
      );
      newRequisition.setReproducts(products); // Associate products with the requisition
    }

    res.json(newRequisition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assuming you have imported the necessary models and dependencies

exports.updateRequireQty = async (req, res) => {
  const requireQtyUpdates = req.body;

  try {
    // Loop through each requireQty update
    for (const update of requireQtyUpdates) {
      const { requationId, requireQty } = update;

      // Check if the contract product exists
      const existingContractProduct = await Reproduct.findOne({
        where: { id: requationId },
      });

      if (!existingContractProduct) {
        return res
          .status(404)
          .json({
            error: `Contract product with ID ${contractProductId} not found in contract ${contractId}`,
          });
      }

      // Update requireQty field
      existingContractProduct.requireqty = requireQty;
      await existingContractProduct.save();
    }

    res.status(200).json({ message: "RequireQty updated successfully" });
  } catch (error) {
    console.error("Error updating requireqty:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.detailsbuttonedit = async (req, res) => {
  const requationId = req.params.requstion;

  try {
    const contractIds = await Reproduct.findAll({
      where: {
        requationId: requationId,
      },
    });

    const id = contractIds.map(contract => contract.contractproductid);

    const contractSpaces = await Storagespace.findAll({
      where: {
        contractproduct: id,
      },
      include: [
        {
          model: ContractProduct,
          as: "contractp",
          include: [
            {
              model: Contract,
              as: "space",
              where: {
                status: "Ongoing",
              },
            },
            {
              model: Product,
              as: "product",
              include: [
                { model: Variant },
                { model: Quality },
                { model: Size },
                { model: Unit },
                { model: Commodity },
              ],
            },
          ],
        },
        {
          model: SpaceDetails,
          as: "productSpaceDetails",
        },
      ],
    });

    const contracts = {};
    contractSpaces.forEach(space => {
      const contractId = space.contractp.id;
      if (!contracts[contractId]) {
        contracts[contractId] = {
          contract: space.contractp,
          productDetails: [],
        };
      }
      contracts[contractId].productDetails.push(space.productSpaceDetails);
    });

    const data = Object.values(contracts);
    const productDetailsMap = {};
    data.forEach(item => {
      const contract = item.contract;
      if (contract && contract.product) {
        const productId = contract.product.id;
        if (!productDetailsMap[productId]) {
          productDetailsMap[productId] = {
            id: productId,
            variant: contract.product.varient.varient,
            commodity: contract.product.commodity.commodity,
            size: contract.product.size.size,
            quality: contract.product.quality.quality,
            unit: contract.product.unit.unit,
            contracts: [],
          };
        }
        productDetailsMap[productId].contracts.push({
          contractid: contract.space.id,
          contractproductid: contract.id,
          slno: contract.space.slno,
          qty: contract.qty,
          spacedetails: item.productDetails.map(detail => ({
            space: detail.space, // Extract space details here
          })),
        });
      }
    });

    const datas = Object.values(productDetailsMap);

    // Include requireQty from Reproduct model for each contract
    datas.forEach(data => {
      data.contracts.forEach(contract => {
        const correspondingReproduct = contractIds.find(
          reproduct =>
            reproduct.contractproductid === contract.contractproductid
        );
        if (correspondingReproduct) {
          contract.requireQty = correspondingReproduct.requireqty;
          contract.deliveryQty = correspondingReproduct.deliveryQty;
          contract.requstionid = correspondingReproduct.id;
        }
      });
    });

    res.json(datas);
  } catch (error) {
    console.error("Error fetching contract spaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
