// controllers/requisitionController.js
const Requisition = require('../models/requisition');
const Contract = require("../models/contract");
const userTable = require("../models/user");

const Product = require("../models/product");

const ContractProduct = require("../models/contractproduct");
const {  Op } = require('sequelize');

const Variant = require("../models/varient");
const Quality = require("../models/quality");
const Size = require("../models/size");
const Unit = require("../models/unit");
const Commodity = require("../models/commodity")
const Sequelize = require("sequelize");
const SpaceDetails = require("../models/SpaceDetails");
const  Location  = require('../models/location');
const Reproduct = require("../models/reproduct");

const sequelize = require("../util/database");

exports.createRequisition = async (req, res) => {
  try {
    const { date, contractId, storageId,underValues, productdetails } = req.body;
    const partyid = req.params.partyid;
    const user = await userTable.findByPk(partyid);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let under = null;

    if (user.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      under = partyid;
    } else if (user.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      under = user.under;
    }

    const newRequisition = await Requisition.create({
      date,
      status: 'pending',
      contractId,
      storageId,
      underValues,
      partyid:under,
    });

    // Assuming productdetails is an array of products for the requisition
    if (productdetails && productdetails.length > 0) {
      const products = await Reproduct.bulkCreate(
        productdetails.map((product) => ({
          requireqty: product.requireqty,
          deliveryQty: product.deliveryQty,
          contractproductid: product.contractproductid, // Assuming this is the ID from ContractProduct
          requationId: newRequisition.id,
        }))
      );
      newRequisition.setReproducts(products); // Associate products with the requisition
    }

    res.json(newRequisition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getRequisitionsByPartyId = async (req, res) => {
  try {
   
    const partyid = req.params.partyid;
    const user = await userTable.findByPk(partyid);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
        status:'pending'
      },
      include: [
        {
          model: Contract, 
          as:'conf',
          attributes: ['id', 'contractstartdate','slno'], // Specify the attributes you want to include
          include: [{ model: Location, as: 'location', attributes: ['storagename'] }],
        },
      ],
    });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};











exports.getRequisitionsByPartycompleted = async (req, res) => {
  try {
    const partyid = req.params.partyid;
    const user = await userTable.findByPk(partyid);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
        status:'Completed'
      },
      include: [
        {
          model: Contract, 
          as:'conf',
          attributes: ['id', 'contractstartdate', 'slno'], // Specify the attributes you want to include
          include: [{ model: Location, as: 'location', attributes: ['storagename'] }],
        },
      ],
    });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getRequisitionById = async (req, res) => {
  try {
    const requisitionId = req.params.requisitionId;

    const requisition = await Reproduct.findAll({
      where: {
        requationId:requisitionId ,
      },
      include: [
        {
          model: ContractProduct,
          as: 'contractproduct',
          attributes: ['id', 'qty', 'productid'], // Include only the attributes you want
          include: [
            {
              model: Product,
              as: 'product',
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
          ],
        },
      ],
    });

    if (!requisition) {
      return res.status(404).json({ error: 'Requisition not found' });
    }

    res.json(requisition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};













exports.getRequisitionId = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userTable.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
        status: 'pending',
        // Assuming there's a field named 'under' in your Requisition model
        underValues:under
      },
      include: [
        {
          model: Contract,
          as: 'conf',
          attributes: ['id', 'contractstartdate', 'slno'],
          include: [{ model: Location, as: 'location', attributes: ['storagename'] }],
        },
        {
          model: userTable,
          as: 'part',
          attributes: ['name'],
        },
      ],
    });

    res.json(requisitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getRequisitionIdcompleted = async (req, res) => {
  
    try{
      const userId = req.params.id;
      const user = await userTable.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      let under = null;
  
      if (user.userTypeId === 3) {
        // If user type ID is 3, set under to the user ID
        under = userId;
      } else if (user.userTypeId === 5) {
        // If user type ID is 5, set under to the user's under value
        under = user.under;
      }
  console.log(under)
      const requisitions = await Requisition.findAll({
        where: {
          status: 'Completed',
          // Assuming there's a field named 'under' in your Requisition model
          underValues:under
        },
        include: [
          {
            model: Contract,
            as: 'conf',
            attributes: ['id', 'contractstartdate', 'slno'],
            include: [{ model: Location, as: 'location', attributes: ['storagename'] }],
          },
          {
            model: userTable,
            as: 'part',
            attributes: ['name'],
          },
        ],
      });
  
      res.json(requisitions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
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
            await ContractProduct.decrement(
                'qty',
                {
                    by: deliveryQty,
                    where: { id: contractproductid }
                }
            );
        }

        // If all updates were successful, update the status to 'Completed' for corresponding requationId
        if (updatedReproduct !== null) {
            const { requationId } = updatedReproduct;

            await Requisition.update(
                { status: 'Completed' },
                {
                    where: {
                        id: requationId
                    }
                }
            );

            res.json({ message: 'Delivery quantities updated successfully' });
        } else {
            res.status(500).json({ error: 'Failed to update delivery quantities' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
