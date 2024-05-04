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
      include: [
        { association: "valueofunde", attributes: ["id", "companyname"] },
        // Add more associations as needed
      ],
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
      include: [
        { association: "valueofunde", attributes: ["id", "companyname"] },
        // Add more associations as needed
      ],
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
    console.log(requisition);
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

      const qty = contractProduct.requireqty;
      const dqty = contractProduct.deliveryQty; // Assuming 'requireqty' is the field representing quantity
      if (productMap.has(productName)) {
        productMap.get(productName).qty += qty;
        productMap.get(productName).dqty += dqty;
      } else {
        productMap.set(productName, { qty, ...productDetails, dqty });
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
exports.updateDeliveryQty = async (req, res) => {
  try {
    const deliveryDataArray = req.body; // Assuming the array of data is in the request body
    let success = true;
    let updatedReproduct = null; // Initialize to null

    // Loop through the array and update each record
    for (const deliveryData of deliveryDataArray) {
      const { id, deliveryQty } = deliveryData;

      const existingReproduct = await Reproduct.findOne({
        where: { id },
      });

      if (existingReproduct.Status === 1) {
        await Reproduct.update(
          {
            deliveryQty: deliveryQty,
            previousqty: deliveryQty,
            Status: 2,
          },
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

        // Assuming 'contractproductid' is a column name in your Reproduct table
        const { contractproductid } = updatedReproduct;

        // Subtract delivered quantity from contract product quantity
        await ContractProduct.decrement(
          
                    'qty',
                    {
                        by: deliveryQty,
                        where: { id: contractproductid }
                    }
                    
                );

        // Update the amount for ContractProduct
        const updatedContractProduct = await ContractProduct.findOne({
          where: { id: contractproductid },
        });
        await updatedContractProduct.update({
          amount: updatedContractProduct.qty * updatedContractProduct.rate,
        });
      }else {
        const updatedRow = await Reproduct.findOne({ where: { id: id } });

        updatedReproduct = updatedRow;

        const { contractproductid } = updatedReproduct;

        const updatedReproduc = await ContractProduct.findOne({
          where: { id: contractproductid },
        });
        const newQty =
          updatedReproduc.qty - (deliveryQty - existingReproduct.previousqty);

        await ContractProduct.update(
          { qty: newQty },
          { where: { id: contractproductid } }
        );

        await ContractProduct.update(
          { amount: newQty * updatedReproduc.rate },
          { where: { id: contractproductid } }
        );

        await Reproduct.update(
          {
            deliveryQty: deliveryQty,
            previousqty: deliveryQty,
          },
          { where: { id: id } }
        );
      }
    }

    // If all updates were successful, update the status to 'Completed' for corresponding requisitionId
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
    const {
      date,
      underValues,
      storageId,
      expecteddelivery,
      requisitionDetails,
    } = req.body;
    const partyId = req.params.partyid;

    const user = await userTable.findByPk(partyId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let partyunder = null;

    if (user.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      partyunder = partyId;
    } else if (user.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      partyunder = user.under;
    }

    // Create a single requisition
    const newRequisition = await Requisition.create({
      date,
      status: "pending",
      partyid: partyunder,
      underValues: underValues,
      storageId,
      expecteddelivery,
    });

    const users = await userTable.findByPk(partyunder);
    console.log(users.reqsitioncount);
    users.reqsitioncount = users.reqsitioncount + 1;
    await users.save();
    console.log(users.reqsitioncount);

    // Generate requisition serial number
    const currentYear = new Date().getFullYear();
    const slno = `RQ/${partyunder}/${currentYear}/${users.reqsitioncount}`;
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
            previousqty: 0,
            Status: 1,
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
    console.log(id);
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
            variant: contract.product?.varient?.varient,
            commodity: contract.product?.commodity?.commodity,
            size: contract.product?.size?.size,
            quality: contract.product?.quality?.quality,
            unit: contract.product?.unit?.unit,
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

exports.getmanufactureId = async (req, res) => {
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
    const location = req.params.location;

    const requisitions = await Requisition.findAll({
      where: {
        status: "pending",
        underValues: under,
        storageId: location,
      },
      include: [
        {
          model: userTable,
          as: "part",
          attributes: ["id", "name", "mobileNumber"],
        },
      ],
    });

    const uniqueParties = [];
    const seenIds = new Set();

    requisitions.forEach(contract => {
      const partyId = contract.partyid;
      if (!seenIds.has(partyId)) {
        seenIds.add(partyId);
        uniqueParties.push({
          id: partyId,
          name: contract.part.name,
          mobileNumber: contract.part.mobileNumber, // Assuming the name attribute is retrieved from the included userTable model
        });
      }
    });

    res.status(200).json(uniqueParties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequisitionfortabledatapending = async (req, res) => {
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

    const location = req.params.location;
    const partyids = req.body.partyid;

    // Array to store requisitions
    const allRequisitions = [];

    for (const partyid of partyids) {
      const requisitions = await Requisition.findAll({
        where: {
          status: "pending",
          underValues: under,
          storageId: location,
          partyid,
        },
      });

      allRequisitions.push(requisitions);
    }

    return res.status(200).json(allRequisitions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getRequisitionfortabledatacomplete = async (req, res) => {
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

    const location = req.params.location;
    const partyids = req.body.partyid;

    // Array to store requisitions
    const allRequisitions = [];

    for (const partyid of partyids) {
      const requisitions = await Requisition.findAll({
        where: {
          status: "Completed",
          underValues: under,
          storageId: location,
          partyid,
        },
      });

      allRequisitions.push(requisitions);
    }

    return res.status(200).json(allRequisitions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getmanufactureIdcompleted = async (req, res) => {
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
    const location = req.params.location;

    const requisitions = await Requisition.findAll({
      where: {
        status: "Completed",
        underValues: under,
        storageId: location,
      },
      include: [
        {
          model: userTable,
          as: "part",
          attributes: ["id", "name", "mobileNumber"],
        },
      ],
    });

    const uniqueParties = [];
    const seenIds = new Set();

    requisitions.forEach(contract => {
      const partyId = contract.partyid;
      if (!seenIds.has(partyId)) {
        seenIds.add(partyId);
        uniqueParties.push({
          id: partyId,
          name: contract.part.name,
          mobileNumber: contract.part.mobileNumber, // Assuming the name attribute is retrieved from the included userTable model
        });
      }
    });

    res.status(200).json(uniqueParties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequisitionIdcomplet = async (req, res) => {
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
        status: "Completed",
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

exports.getRequisitionsBycoldstorageadmi = async (req, res) => {
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
        underValues: under,
        status: "pending",
      },
      include: [
        { association: "valueofunde", attributes: ["id", "companyname"] },
        // Add more associations as needed
      ],
    });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRequisitionsBycoldstorageadmicomplete = async (req, res) => {
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
        underValues: under,
        status: "Completed",
      },
      include: [
        { association: "valueofunde", attributes: ["id", "companyname"] },
        // Add more associations as needed
      ],
    });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
