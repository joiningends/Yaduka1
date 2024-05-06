const Contract = require("../models/contract");
const userTable = require("../models/user");
const ContractSpace = require("../models/contractspace");
const Invoice = require("../models/invoice");
const Product = require("../models/product");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const ContractProduct = require("../models/contractproduct");
//const { Op } = require('sequelize');
const Variant = require("../models/varient");
const Quality = require("../models/quality");
const Size = require("../models/size");
const Unit = require("../models/unit");
const Commodity = require("../models/commodity");
const Sequelize = require("sequelize");
const SpaceDetails = require("../models/SpaceDetails");
const Location = require("../models/location");
const party = require("../models/party");
const UserUnder = require("../models/userunder");
const GstType = require("../models/gsttype");
const GstRate = require("../models/gstrate");
const Storagespace = require("../models/storagespace");
const StoragespaceArea = require("../models/storagespacearea");
const Reproduct = require("../models/reproduct");
const {
  sendWhatsAppMessage,
  sendWhatsAppMessageMedia,
  getSentMessageCount,
  getSentMessages,
} = require("../Controllers/whatsappController");
const { sendnotificationByEmail } = require("../Controllers/emailController");

exports.createContract = async (req, res) => {
  const userId = req.params.id;
  const user = await userTable.findByPk(userId);
  const dynamicyear = new Date().getFullYear();

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

  try {
    const {
      storageId,
      partyId,
      partyidinpartytable,
      storagetype,
      renewaldays,
      contractstartdate,
      Gstapplicable,
      gstrate,
      gsttype,
    } = req.body;

    let existingUser;

    if (typeof partyId === "undefined" || partyId === null) {
      // If partyId is not provided or null, fetch data from party table using partyidinpartytable
      const partyData = await party.findByPk(partyidinpartytable);

      if (!partyData) {
        return res.status(404).json({ error: "Party data not found" });
      }

      // Check if the user already exists
      existingUser = await userTable.findOne({
        where: {
          mobileNumber: partyData.mobileNumber,
        },
      });
      console.log(existingUser);
      if (existingUser) {
        const existingAssociation = await UserUnder.findOne({
          where: {
            partyid: existingUser.id,
            underValues: under,
          },
        });

        if (!existingAssociation) {
          // Association doesn't exist, create in UserUnder
          await UserUnder.create({
            partyid: existingUser.id,
            underValues: under,
          });
        }
      } else {
        // User already exists, check if association is present in UserUnder
        // If the user doesn't exist, create a new user
        existingUser = await userTable.create({
          name: partyData.contactPerson,
          mobileNumber: partyData.mobileNumber,
          address: partyData.address,
          terminate: partyData.isBacklist,
          companyname: partyData.businessName,
          userTypeId: 4,
        });

        // Save association in UserUnder table
        await UserUnder.create({
          partyid: existingUser.id,
          underValues: under,
        });
      }
    } else {
      existingUser = await userTable.findByPk(partyId);
    }

    const newContract = await Contract.create({
      under,
      storageId,
      partyId: existingUser.id,
      storagetype,
      renewaldays,
      contractstartdate,
      Gstapplicable,
      gstrate,
      gsttype,
      status: "Draft",
    });
    const users = await userTable.findByPk(under);
    users.contractcount = users.contractcount + 1;
    await users.save();
    const currentYear = new Date().getFullYear();
    const slno = `CTR/${users.id}/${currentYear}/${users.contractcount}`;
    newContract.slno = slno;
    await newContract.save();

    // Respond with the newly created contract
    res.status(201).json(newContract);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllDraftContracts = async (req, res) => {
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
    const draftContracts = await Contract.findAll({
      where: {
        status: "Draft",
        under: under,
      },
      include: [
        { association: "location", attributes: ["id", "storagename"] },
        { association: "gstRate", attributes: ["id", "percentage"] },
        { association: "gstType", attributes: ["id", "name"] },
        { association: "partyuser", attributes: ["id", "name"] },
        // Add more associations as needed
      ],
    });

    res.status(200).json(draftContracts);
  } catch (error) {
    console.error("Error fetching draft contracts with associations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getDraftContractById = async (req, res) => {
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

    const contractId = req.params.contractid;

    let includeAssociations = [
      { association: "location", attributes: ["id", "storagename"] },
      { association: "gstRate", attributes: ["id", "percentage"] },
      { association: "gstType", attributes: ["id", "name"] },
    ];

    // Assuming you have a way to determine the properties of the contract
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    if (contract.partyidinpartytable === null) {
      includeAssociations.push({
        association: "partyuser",
        attributes: ["id", "name"],
      });
    }

    if (contract.partyId === null) {
      includeAssociations.push({
        association: "partyus",
        attributes: ["id", "name"],
      });
    }

    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: "Draft",
        under: under,
      },
      include: includeAssociations,
    });

    if (!draftContract) {
      return res.status(404).json({ error: "Draft Contract not found" });
    }

    res.status(200).json(draftContract);
  } catch (error) {
    console.error(
      "Error fetching draft contract by ID with associations:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateContract = async (req, res) => {
  try {
    const contractId = req.params.id;
    const userId = req.params.userid;
    const user = await userTable.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let under = null;

    if (user.userTypeId === 3) {
      under = userId;
    } else if (user.userTypeId === 5) {
      under = user.under;
    }

    const existingContract = await Contract.findByPk(contractId);

    if (!existingContract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    const renewalDays = parseInt(existingContract.renewaldays, 10);
    const contractStartDate = new Date(existingContract.contractstartdate);
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);

    const add = existingContract.invoiceno + 1;
    await existingContract.update({
      invoiceno: add,
      status: "Ongoing",
      nextinvoicedate: nextInvoiceDate.toISOString(),
    });

    const { storagespaces } = req.body;

    if (storagespaces && Array.isArray(storagespaces)) {
      await Promise.all(
        storagespaces.map(async space => {
          const newContractsp = await ContractSpace.create({
            ...space,
            contractId: existingContract.id,
          });

          const rooms = space.storagespace;

          if (Array.isArray(rooms)) {
            await Promise.all(
              rooms.map(async room => {
                await StoragespaceArea.create({
                  Areaspaces: room,
                  contractspace: newContractsp.id,
                });
              })
            );
          } else if (rooms) {
            await Storagespace.create({
              Areaspaces: rooms,
              contractspace: newContractsp.id,
            });
          }
        })
      );
    }

    const contractProducts = await ContractSpace.findAll({
      where: { contractId: existingContract.id },
    });

    const storages = await Promise.all(
      contractProducts.map(async store => {
        const storagespaces = await StoragespaceArea.findAll({
          where: { contractspace: store.id },
          include: [
            {
              model: SpaceDetails,
              as: "AreaSpaceDetails",
            },
            {
              model: ContractSpace,
              as: "contractspac",
            },
          ],
        });

        return {
          contractspac: storagespaces[0].contractspac,
          AreaSpaceDetails: storagespaces.map(space => space.AreaSpaceDetails),
        };
      })
    );

    const tableData = storages.map(product => ({
      storagespace: Array.isArray(product.AreaSpaceDetails)
        ? product.AreaSpaceDetails.map(detail => detail.space).join(", ")
        : product.AreaSpaceDetails.space,
      qty: product.contractspac.qty,
      rate: product.contractspac.rate,
      amount: product.contractspac.amount,
    }));
    console.log(tableData);
    const pdfFilePath = await generatePDF(
      under,
      existingContract.id,
      tableData
    );

    res.status(200).json(existingContract);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateInvoiceNumber = async (userId, currentYear) => {
  // Get the count of invoices generated for the user in the current year
  const count = await Invoice.count({
    where: {
      userId: userId,
      createdAt: {
        [Op.between]: [
          new Date(`${currentYear}-01-01`),
          new Date(`${currentYear}-12-31`),
        ],
      },
    },
  });
  console.log(userId);
  // Increment the count and format it with leading zeros
  const invoiceNumber = `INV_${userId}_${currentYear.toString().slice(-2)}_${(
    count + 1
  )
    .toString()
    .padStart(4, "0")}`;

  return invoiceNumber;
};

exports.updateContractforproduct = async (req, res) => {
  try {
    const contractId = req.params.id;
    const userId = req.params.userid;
    const user = await userTable.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let under = null;

    if (user.userTypeId === 3) {
      under = userId;
    } else if (user.userTypeId === 5) {
      under = user.under;
    }

    const existingContract = await Contract.findByPk(contractId);

    if (!existingContract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    const renewalDays = parseInt(existingContract.renewaldays, 10);

    const contractStartDate = new Date(existingContract.contractstartdate);

    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);

    const add = existingContract.invoiceno + 1;
    await existingContract.update({
      invoiceno: add,
      status: "Ongoing",
      nextinvoicedate: nextInvoiceDate.toISOString(),
    });

    const { storagespaces } = req.body;

    if (storagespaces && Array.isArray(storagespaces)) {
      await Promise.all(
        storagespaces.map(async space => {
          const existingSpace = await ContractProduct.findOne({
            where: {
              contractId: existingContract.id,
              productid: space.productid || null,
            },
          });

          if (!existingSpace) {
            const newContractProduct = await ContractProduct.create({
              ...space,
              contractId: existingContract.id,
            });
            console.log(newContractProduct);
            const rooms = space.storagespace;
            const productId = space.productid;
            console.log("allrooms", rooms);
            if (Array.isArray(rooms)) {
              await Promise.all(
                rooms.map(async room => {
                  await Storagespace.create({
                    productspaces: room,
                    contractproduct: newContractProduct.id,
                    contractId: existingContract.id,
                    productid: productId,
                  });
                })
              );
            } else if (rooms) {
              // If rooms is not an array but exists, create a single Storagespace
              await Storagespace.create({
                productspaces: rooms,
                contractproduct: newContractProduct.id,
                contractId: existingContract.id,
                productid: productId,
              });
            }
            // If rooms is null or undefined, there is nothing to do, so you can omit it.
          }
        })
      );
    }

    const contractProducts = await ContractProduct.findAll({
      where: { contractId: existingContract.id },
    });

    const storages = await Promise.all(
      contractProducts.map(async store => {
        const storagespaces = await Storagespace.findAll({
          where: { contractproduct: store.id },
          include: [
            {
              model: ContractProduct,
              as: "contractp",
            },
            {
              model: SpaceDetails,
              as: "productSpaceDetails",
            },
          ],
        });
        return {
          contractp: storagespaces[0].contractp,
          productSpaceDetails: storagespaces.map(
            space => space.productSpaceDetails
          ),
        };
      })
    );

    const tableData = storages.map(product => ({
      storagespace: Array.isArray(product.productSpaceDetails)
        ? product.productSpaceDetails.map(detail => detail.space).join(", ")
        : product.productSpaceDetails.space,
      qty: product.contractp.qty,
      rate: product.contractp.rate,
      amount: product.contractp.amount,
    }));

    console.log(tableData);
    const pdfFilePath = await generatePDF(
      under,
      existingContract.id,
      tableData
    );

    res.status(200).json(existingContract);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getongoingContrforarea = async (req, res) => {
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

    const contractId = req.params.contractid;

    let includeAssociations = [
      { association: "location", attributes: ["id", "storagename"] },
      { association: "gstRate", attributes: ["id", "percentage"] },
      { association: "gstType", attributes: ["id", "name"] },
    ];

    // Assuming you have a way to determine the properties of the contract
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    if (contract.partyidinpartytable === null) {
      includeAssociations.push({
        association: "partyuser",
        attributes: ["id", "name"],
      });
    }

    if (contract.partyId === null) {
      includeAssociations.push({
        association: "partyus",
        attributes: ["id", "name"],
      });
    }

    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: "Ongoing",
        under: under,
      },
      include: includeAssociations,
    });

    if (!draftContract) {
      return res.status(404).json({ error: "Ongoing Contract not found" });
    }

    // ...
    const renewalDays = parseInt(draftContract.renewaldays, 10);

    // Parse contract start date
    const [day, month, year] = draftContract.contractstartdate
      .split("-")
      .map(Number);
    const contractStartDate = new Date(year, month - 1, day); // month is zero-based

    // Calculate next invoice date
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);

    const invoices = await Invoice.findAll({
      where: { contractId: draftContract.id },
      order: [["createdAt", "DESC"]],
    });

    // Extract the first invoice (latest invoice)
    const latestInvoice = invoices.length > 0 ? invoices[0] : null;

    // Count the number of invoices for the contract
    const invoiceCount = invoices.length;

    // ...

    let nextRentalAmount = 0;

    // Check storagetype and quantity conditions
    if (draftContract.storagetype === "Area") {
      // Calculate next rental amount from ContractSpaces for 'Area' storagetype
      const contractSpaces = await ContractSpace.findAll({
        where: { contractId: draftContract.id },
      });

      // Calculate total amount from ContractSpaces
      nextRentalAmount = contractSpaces.reduce((total, space) => {
        return total + space.amount;
      }, 0);

      // If contract status is 'Closed', set nextRentalAmount to 0
      if (draftContract.status === "Closed") {
        nextRentalAmount = 0;
      }
    } else if (draftContract.storagetype === "Product") {
      // Calculate next rental amount for 'Product' storagetype
      const contractSpaces = await ContractProduct.findAll({
        where: { contractId: draftContract.id, qty: { [Op.not]: 0 } },
      });

      // Calculate total amount from ContractSpaces
      nextRentalAmount = contractSpaces.reduce((total, space) => {
        return total + space.amount;
      }, 0);
    }
    draftContract.nextRentalAmount = nextRentalAmount;
    await draftContract.save();

    // ...

    res.status(200).json({
      contract: draftContract,
      nextInvoiceDate: nextInvoiceDate.toISOString(),
      nextRentalAmount: nextRentalAmount,
      latestInvoice: latestInvoice,
      invoiceCount: invoiceCount,
    });
  } catch (error) {
    console.error("Error fetching ongoing contract with associations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllongoinContracts = async (req, res) => {
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
    const draftContracts = await Contract.findAll({
      where: {
        status: "Ongoing",
        under: under,
      },
      include: [
        { association: "location", attributes: ["id", "storagename"] },
        { association: "gstRate", attributes: ["id", "percentage"] },
        { association: "gstType", attributes: ["id", "name"] },
        { association: "partyuser", attributes: ["id", "name"] },
        // Add more associations as needed
      ],
    });

    res.status(200).json(draftContracts);
  } catch (error) {
    console.error("Error fetching draft contracts with associations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getContractProductsByContractId = async (req, res) => {
  try {
    const contractId = req.params.contractId;

    // Fetch contract products based on the contractId and where qty is not 0
    const contractProducts = await ContractProduct.findAll({
      where: {
        contractId,
        qty: {
          [Sequelize.Op.not]: 0,
        },
      },
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
      ],
    });

    res.status(200).json(contractProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getContractSpacesByContractId = async (req, res) => {
  try {
    const contractId = req.params.contractId;

    // Fetch contract spaces based on the contractId and where contract.status is not 'Closed'

    const contractProducts = await ContractSpace.findAll({
      where: { contractId: contractId },
    });

    const storages = await Promise.all(
      contractProducts.map(async store => {
        const storagespaces = await StoragespaceArea.findAll({
          where: { contractspace: store.id },
          include: [
            {
              model: SpaceDetails,
              as: "AreaSpaceDetails",
            },
            {
              model: ContractSpace,
              as: "contractspac",
            },
          ],
        });

        return {
          contractspac: storagespaces[0].contractspac,
          AreaSpaceDetails: storagespaces.map(space => space.AreaSpaceDetails),
        };
      })
    );

    res.status(200).json(storages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateContractStatus = async (req, res) => {
  try {
    const contractId = req.params.contractId;
    const status = req.body.status;

    // Update the status of the contract
    const updatedContract = await Contract.update(
      { status },
      { where: { id: contractId } }
    );

    if (updatedContract[0] === 1) {
      res.status(200).json({ message: "Contract status updated successfully" });
    } else {
      res.status(404).json({ error: "Contract not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getcompleteContractById = async (req, res) => {
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

    const contracts = await Contract.findAll({
      where: { under: under, status: "Closed" }, // Assuming the foreign key in the Contract model is partyId
      include: [
        { association: "location", attributes: ["id", "storagename"] },
        { association: "gstRate", attributes: ["id", "percentage"] },
        { association: "gstType", attributes: ["id", "name"] },
        { association: "partyuser", attributes: ["id", "name"] },
        // Add more associations as needed
      ],
    });

    res.status(200).json(contracts);
  } catch (error) {
    console.error(
      "Error fetching draft contract by ID with associations:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStorageIdByPartyId = async (req, res) => {
  const partyId = req.params.id;

  try {
    // Find all contracts with the given partyId and include associated Location data
    const contracts = await Contract.findAll({
      where: { partyId, storagetype: "Product" },
      include: [
        { model: Location, as: "location", attributes: ["storagename"] },
      ],
    });

    if (!contracts || contracts.length === 0) {
      return res
        .status(404)
        .json({ message: "No contracts found for the provided partyId" });
    }

    // Extract storage data from the contracts
    const storageData = contracts.map(contract => ({
      storageId: contract.storageId,
      storageName: contract.location.storagename, // Access storagename through the association
    }));

    res.json({ storageData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllContractsByPartyAndStorage = async (req, res) => {
  const { partyId, storageId } = req.params;

  try {
    // Find all contracts with the given partyId, storageId, and storagetype='Product'
    const contracts = await Contract.findAll({
      where: {
        partyId,
        storageId,
        storagetype: "Product",
        status: "Ongoing", // Add this line to filter by storagetype
      },
      include: [
        { model: Location, as: "location", attributes: ["storagename"] },
      ],
    });

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({
        message:
          "No contracts found for the provided partyId, storageId, and storagetype=Product",
      });
    }

    // Extract all details of each contract including storage information
    const contractData = contracts.map(contract => ({
      contractId: contract.id,
      contractname: contract.slno,
      partyId: contract.partyId,
      storageId: contract.storageId,
      storageName: contract.location.storagename,
      storagetype: contract.location.storagetype,
      // Add other contract properties as needed
      renewaldays: contract.renewaldays,
      contractstartdate: contract.contractstartdate,
      Gstapplicable: contract.Gstapplicable,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
      status: contract.status,
      gstrate: contract.gstrate,
      gsttype: contract.gsttype,
      partyId: contract.partyId,
      under: contract.under,
      invoiceno: contract.invoiceno,
    }));

    res.json({ contractData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getContract = async (req, res) => {
  try {
    const contractId = req.params.contractId;
    const contractProducts = await ContractProduct.findAll({
      where: {
        contractId: contractId,
        qty: {
          [Op.gt]: 0, // Exclude records where qty is zero
        },
      },
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
      ],
    });
    res.json(contractProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStorageIdByParty = async (req, res) => {
  const partyId = req.params.id;
  const userId = req.params.userId;
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

  try {
    // Find all contracts with the given partyId and include associated Location data
    const contracts = await Contract.findAll({
      where: { partyId, under: under },
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["storagename", "address"],
        },
      ],
    });

    if (!contracts || contracts.length === 0) {
      return res
        .status(404)
        .json({ message: "No contracts found for the provided partyId" });
    }

    // Use a Set to store unique storageIds
    const uniqueStorageIds = new Set();

    // Filter contracts and store unique storage details
    const storageDetails = contracts.reduce(
      (uniqueStorageDetails, contract) => {
        // Check if the storageId is already in the Set
        if (!uniqueStorageIds.has(contract.storageId)) {
          // If not, add it to the Set and push the storage details to the result array
          uniqueStorageIds.add(contract.storageId);
          uniqueStorageDetails.push({
            storageId: contract.storageId,
            storageName: contract.location.storagename,
            address: contract.location.address,
          });
        }
        return uniqueStorageDetails;
      },
      []
    );

    res.json({ storageDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getongoingContrforparty = async (req, res) => {
  try {
    const contractId = req.params.contractid;

    let includeAssociations = [
      { association: "location", attributes: ["id", "storagename"] },
      { association: "gstRate", attributes: ["id", "percentage"] },
      { association: "gstType", attributes: ["id", "name"] },
    ];

    // Assuming you have a way to determine the properties of the contract
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    if (contract.partyidinpartytable === null) {
      includeAssociations.push({
        association: "partyuser",
        attributes: ["id", "name"],
      });
    }

    if (contract.partyId === null) {
      includeAssociations.push({
        association: "partyus",
        attributes: ["id", "name"],
      });
    }

    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: "Ongoing",
      },
      include: includeAssociations,
    });

    if (!draftContract) {
      return res.status(404).json({ error: "Ongoing Contract not found" });
    }

    // ...
    const renewalDays = parseInt(draftContract.renewaldays, 10);

    // Parse contract start date
    const [day, month, year] = draftContract.contractstartdate
      .split("-")
      .map(Number);
    const contractStartDate = new Date(year, month - 1, day); // month is zero-based

    // Calculate next invoice date
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);

    const invoices = await Invoice.findAll({
      where: { contractId: draftContract.id },
      order: [["createdAt", "DESC"]],
    });

    // Extract the first invoice (latest invoice)
    const latestInvoice = invoices.length > 0 ? invoices[0] : null;

    // Count the number of invoices for the contract
    const invoiceCount = invoices.length;

    // ...

    let nextRentalAmount = 0;

    // Check storagetype and quantity conditions
    if (draftContract.storagetype === "Area") {
      // Calculate next rental amount from ContractSpaces for 'Area' storagetype
      const contractSpaces = await ContractSpace.findAll({
        where: { contractId: draftContract.id },
      });

      // Calculate total amount from ContractSpaces
      nextRentalAmount = contractSpaces.reduce((total, space) => {
        return total + space.amount;
      }, 0);

      // If contract status is 'Closed', set nextRentalAmount to 0
      if (draftContract.status === "Closed") {
        nextRentalAmount = 0;
      }
    } else if (draftContract.storagetype === "Product") {
      // Calculate next rental amount for 'Product' storagetype
      const contractSpaces = await ContractProduct.findAll({
        where: { contractId: draftContract.id, qty: { [Op.not]: 0 } },
      });

      // Calculate total amount from ContractSpaces
      nextRentalAmount = contractSpaces.reduce((total, space) => {
        return total + space.amount;
      }, 0);
    }

    // ...

    res.status(200).json({
      contract: draftContract,
      nextInvoiceDate: nextInvoiceDate.toISOString(),
      nextRentalAmount: nextRentalAmount,
      latestInvoice: latestInvoice,
      invoiceCount: invoiceCount,
    });
  } catch (error) {
    console.error("Error fetching ongoing contract with associations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllContractsByPartyId = async (req, res) => {
  try {
    const partyId = req.params.id;

    // Find the party by ID
    const party = await userTable.findByPk(partyId);

    if (!party) {
      return res.status(404).json({ error: "Party not found" });
    }
    let under = null;

    if (party.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      under = partyId;
    } else if (party.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      under = party.under;
    }
    // Find all contracts associated with the party
    const contracts = await Contract.findAll({
      where: { partyId: under, status: "Ongoing" }, // Assuming the foreign key in the Contract model is partyId

      include: [
        { association: "location", attributes: ["id", "storagename"] },
        { association: "gstRate", attributes: ["id", "percentage"] },
        { association: "gstType", attributes: ["id", "name"] },
        { association: "partyuser", attributes: ["id", "name"] },

        { association: "underadmin", attributes: ["id", "companyname"] },
        // Add more associations as needed
      ],
    });

    // Prepare an array to store contracts with nextRentalAmount included
    const contractsWithNextRentalAmount = [];

    // Calculate next rental amount for each contract and include it in the response
    for (const contract of contracts) {
      let nextRentalAmount = 0;

      // Check storagetype and quantity conditions
      if (contract.storagetype === "Area") {
        // Calculate next rental amount from ContractSpaces for 'Area' storagetype
        const contractSpaces = await ContractSpace.findAll({
          where: { contractId: contract.id },
        });

        // Calculate total amount from ContractSpaces
        nextRentalAmount = contractSpaces.reduce((total, space) => {
          return total + space.amount;
        }, 0);

        // If contract status is 'Closed', set nextRentalAmount to 0
        if (contract.status === "Closed") {
          nextRentalAmount = 0;
        }
      } else if (contract.storagetype === "Product") {
        // Calculate next rental amount for 'Product' storagetype
        const contractSpaces = await ContractProduct.findAll({
          where: { contractId: contract.id, qty: { [Op.not]: 0 } },
        });

        // Calculate total amount from ContractSpaces
        nextRentalAmount = contractSpaces.reduce((total, space) => {
          return total + space.amount;
        }, 0);
      }

      // Push contract details along with nextRentalAmount to the array
      contractsWithNextRentalAmount.push({
        contract,
        nextRentalAmount,
      });
    }

    res.status(200).json({ contracts: contractsWithNextRentalAmount });
  } catch (error) {
    console.error("Error fetching contracts by party ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllContractsByPartyIdcompleted = async (req, res) => {
  try {
    const partyId = req.params.id;

    // Find the party by ID
    const party = await userTable.findByPk(partyId);

    if (!party) {
      return res.status(404).json({ error: "Party not found" });
    }
    let under = null;

    if (party.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      under = partyId;
    } else if (party.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      under = party.under;
    }
    // Find all contracts associated with the party
    const contracts = await Contract.findAll({
      where: { partyId: under, status: "Closed" }, // Assuming the foreign key in the Contract model is partyId
      include: [
        { association: "location", attributes: ["id", "storagename"] },
        { association: "gstRate", attributes: ["id", "percentage"] },
        { association: "gstType", attributes: ["id", "name"] },
        { association: "partyuser", attributes: ["id", "name"] },
        // Add more associations as needed
        { association: "underadmin", attributes: ["id", "companyname"] },
      ],
    });

    res.status(200).json(contracts);
  } catch (error) {
    console.error("Error fetching contracts by party ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Function to generate the header of the invoice
function generateHeaders(doc, invoiceDetails) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const textWidth = doc.widthOfString("Tax Invoice");
  const textX = (doc.page.width - textWidth) / 2;

  doc.fontSize(12).text("Tax Invoice", textX, 50).moveDown(1); // Add 1 line of spacing after the title

  // Add logo
  const logoPath = "public/uplds/logoimage.jpeg"; // Adjust the path to your logo image
  doc.image(logoPath, 50, 50, { width: 50 });

  // Add space between logo and company details
  doc.text("", 50, 150); // Add space after the logo
  doc.fontSize(12).text(`${invoiceDetails.name}`, 50, 90);
  doc
    .fontSize(10)
    .text(`${invoiceDetails.street}`, 50, 105)
    .text(`${invoiceDetails.city}`, 50, 120)
    .text(`${invoiceDetails.state}`, 50, 135)
    .moveDown(1) // Add space before the telephone
    .text(`Telephone: ${invoiceDetails.telephone}`, 50, 160)
    .text(`E-mail: ${invoiceDetails.email}`, 50, 175)
    .text(`Website: ${invoiceDetails.website}`, 50, 190)
    .moveDown(1);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(`GSTN: ${invoiceDetails.GSTN}`, 50, 210);
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(`Invoice For: ${invoiceDetails.storage}`, 50, 225);

  doc
    .fontSize(10)
    .text(`Invoice Number: ${invoiceDetails.invoiceNumber}`, 300, 120)
    .text(`Invoice Date: ${currentDate}`, 300, 140)
    .moveDown(); // Add space after the invoice details

  const boxTop = 150;
  const boxLeft = 300;
  const boxWidth = 250;
  const boxHeight = 90;
  doc
    .strokeColor("black")
    .lineWidth(1)
    .rect(boxLeft, boxTop, boxWidth, boxHeight)
    .stroke();

  // Set text color to black
  doc.fillColor("black");

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Invoiced To:", boxLeft + 5, boxTop + 5);
  doc
    .font("Helvetica")
    .fontSize(10) // Change back to default font and size
    .text(`Client Name: ${invoiceDetails.clientName}`, boxLeft + 5, boxTop + 20)
    .text(
      `MobileNumber: ${invoiceDetails.mobileNumber} `,
      boxLeft + 5,
      boxTop + 35
    )

    .text(
      `Client Address: ${invoiceDetails.clientAddress} `,
      boxLeft + 5,
      boxTop + 45
    )

    .text(" ", boxLeft + 5, boxTop + 50);
}

function generateTables(doc, tableData) {
  if (!tableData || !Array.isArray(tableData)) {
    throw new Error("Tables data is invalid or not provided.");
  }

  const tableTop = 280;
  const rowHeight = calculateRowHeight(fontSize, padding);

  // Table headers
  doc.font("Helvetica-Bold").fontSize(12);
  doc.text("Storagespace", 60, tableTop);
  doc.text("Qty", 200, tableTop);
  doc.text("Rate", 320, tableTop);
  doc.text("Amount", 410, tableTop, { width: 90, align: "right" });

  // Function to generate a single row of the table
  function generateTableRow(y, rowData) {
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(rowData.storagespace, 60, y)
      .text(rowData.qty, 200, y)
      .text(rowData.rate, 320, y)
      .text(rowData.amount, 410, y, { width: 90, align: "right" });
  }

  // Table rows
  let yPos = tableTop + 20;

  tableData.forEach(row => {
    if (yPos + rowHeight > doc.page.height - 50) {
      // Check if next row exceeds page height
      doc.addPage(); // Add a new page if the next row will exceed the available space
      yPos = 50; // Reset yPos for the new page
      // Add table headers again on the new page
      doc.font("Helvetica-Bold").fontSize(12);
      doc.text("Storagespace", 60, yPos);
      doc.text("Qty", 200, yPos);
      doc.text("Rate", 320, yPos);
      doc.text("Amount", 410, yPos, { width: 90, align: "right" });
      yPos += 20; // Move yPos to next row
    }
    generateTableRow(yPos, row); // Generate the current row
    yPos += rowHeight; // Move yPos to next row
  });
}

// Function to calculate the row height based on font size and any additional padding
function calculateRowHeight(fontSize, padding = 0) {
  // Add the font size and padding to get the total row height
  return fontSize + padding;
}

const fontSize = 10;
const padding = 5;

function generateFooters(doc, tableData, invoiceDetails) {
  const rowHeight = calculateRowHeight(fontSize, padding);

  // Extract the number of entries (rows) in the tableData
  const rowCount = tableData.length;

  // Calculate the total height of the table dynamically based on the height of each row
  const tableHeight = rowCount * rowHeight; // Total height = number of rows * row height

  let footerTop = 350 + tableHeight; // Adjust footerTop based on the table height

  // Check if the footer content fits within the available space on the page
  const availableSpace = 600; // Adjust based on your page height
  const footerContentHeight = 220; // Adjust based on the total height of footer content

  if (footerTop + footerContentHeight > availableSpace) {
    // If the footer content exceeds the available space, start a new page
    doc.addPage();

    // Reset the footerTop for the new page
    footerTop = 50; // You can adjust this value based on your new page layout
  }
  if (invoiceDetails.gstrate) {
    if (invoiceDetails.gsttype === "CGST&SGST") {
      const CGST = invoiceDetails.gstrate / 2;
      const SGST = invoiceDetails.gstrate / 2;

      doc.font("Helvetica-Bold").fontSize(12);
      doc.text(`Total Fee: ${invoiceDetails.totalAmount}`, 420, footerTop + 5);
      doc.text("Total Taxable Value", 50, footerTop + 25);
      doc.text("GST on Above:", 50, footerTop + 45);
      doc.text(`${invoiceDetails.gstrate}%`, 420, footerTop + 45);
      doc.text("CGST", 50, footerTop + 60);
      doc.text(`${CGST}%`, 420, footerTop + 60);
      doc.text("SGST", 50, footerTop + 75);
      doc.text(`${SGST}%`, 420, footerTop + 75);
      doc.text("Total Invoice Value", 50, footerTop + 90);
      doc.text(`${invoiceDetails.amounts}`, 420, footerTop + 90);
    } else {
      doc.font("Helvetica-Bold").fontSize(12);
      doc.text(`Total Fee: ${invoiceDetails.totalAmount}`, 420, footerTop + 5);
      doc.text("Total Taxable Value", 50, footerTop + 25);

      doc.text("GST on Above:", 50, footerTop + 45);
      doc.text(`${invoiceDetails.gstrate}%`, 420, footerTop + 45);
      doc.text("IGST", 50, footerTop + 60);
      doc.text(`${invoiceDetails.gstrate}%`, 420, footerTop + 60);
      doc.text("Total Invoice Value", 50, footerTop + 75);
      doc.text(`${invoiceDetails.amounts}`, 420, footerTop + 75);
    }
  } else {
    doc.text(`Total Fee: ${invoiceDetails.totalAmount}`, 420, footerTop + 5);
    doc.text("Total Taxable Value", 50, footerTop + 25);

    doc.text("GST on Above:", 50, footerTop + 45);
    doc.text("NA", 420, footerTop + 45);

    doc.text("Total Invoice Value", 50, footerTop + 75);
    doc.text(`${invoiceDetails.amounts}`, 420, footerTop + 75);
  }
  const boxLeft = 40;
  const boxTop = footerTop + 110;
  const boxWidth = 250;
  const boxHeight = 100;
  doc.rect(boxLeft, boxTop, boxWidth, boxHeight).stroke();

  // Add banking details inside the box
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Banking Details:", boxLeft + 5, boxTop + 5)
    .font("Helvetica")
    .fontSize(8)
    .text(
      `Account name: ${invoiceDetails.accountname}`,
      boxLeft + 5,
      boxTop + 20
    )
    .text(`Bank name: ${invoiceDetails.bankName}`, boxLeft + 5, boxTop + 35)
    .text(
      `Account Number: ${invoiceDetails.accountNumber}`,
      boxLeft + 5,
      boxTop + 50
    )
    .text(
      `Account Type: ${invoiceDetails.accounttype}`,
      boxLeft + 5,
      boxTop + 65
    )
    .text(`IFSC Code:${invoiceDetails.IFSC}`, boxLeft + 5, boxTop + 80);

  const tboxLeft = 400;
  const tboxWidth = 150;
  const termsBoxTop = footerTop + 120;
  const termsBoxHeight = 70;
  doc.rect(tboxLeft, termsBoxTop, tboxWidth, termsBoxHeight).stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Terms of Payment:", tboxLeft + 5, termsBoxTop + 5);

  // Add image
  const imagePath = "public/uplds/mysign.png"; // Adjust the path to your image
  doc.image(imagePath, tboxLeft + 10, termsBoxTop + 20, { width: 50 });
  doc
    .font("Helvetica-Oblique")
    .fontSize(10) // Set font to italic
    .text("for", 410, footerTop + 200); // Add italic text "for"

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(`${invoiceDetails.foundername}`, 410, footerTop + 210)
    .text("Founder and Director", 410, footerTop + 220);
}

function generateInvoice(doc, tableData, invoiceDetails) {
  doc.strokeColor("lightblue").lineWidth(3);

  // Draw border around the entire page
  doc.rect(20, 20, 570, 750).stroke();

  // Generate headers
  generateHeaders(doc, invoiceDetails);

  doc.moveTo(50, 200);

  // Generate tables
  generateTables(doc, tableData);
  // Move down to create space

  // Generate footers
  generateFooters(doc, tableData, invoiceDetails);
}

const Address = require("../models/address");
const BankDetails = require("../models/bankdetails");
const Signature = require("../models/signeture");

const generatePDF = async (userId, existingContract, tableData) => {
  try {
    const currentYear = new Date().getFullYear();
    const invoiceNumber = await generateInvoiceNumber(userId, currentYear);
    const fileName = `${invoiceNumber}.pdf`;
    const filePath = `public/uplds/${invoiceNumber}.pdf`;

    const contract = await Contract.findByPk(existingContract, {
      include: [
        { model: GstRate, as: "gstRate", allowNull: true },
        { model: GstType, as: "gstType", allowNull: true },
      ],
    });

    if (!contract) {
      throw new Error("Contract not found");
    }
    const party = await userTable.findByPk(contract.partyId);

    if (!party) {
      throw new Error("User not found");
    }
    let amounts = 0;
    let totalAmount = 0;
    if (contract.gstRate) {
      totalAmount = tableData.reduce((total, rowData) => {
        return total + rowData.amount;
      }, 0);
      amounts = totalAmount + (totalAmount * contract.gstRate.percentage) / 100;
    } else {
      totalAmount = tableData.reduce((total, rowData) => {
        return total + rowData.amount;
      }, 0);
      amounts = totalAmount;
    }
    const invoice = await Invoice.create({
      userId,
      contractId: contract.id,
      name: `${invoiceNumber}`,
      amount: amounts,
      filePath: fileName,
    });

    const addresses = await Address.findAll();
    const banks = await BankDetails.findAll();
    const signs = await Signature.findAll();
    const address = addresses[0];

    const bank = banks[0];

    let invoiceDetails = {};
    const sign = signs[0];
    if (contract.gstRate) {
      invoiceDetails = {
        invoicename: invoice.name,
        clientName: party.name,
        clientAddress: party.address,
        mobileNumber: party.mobileNumber,
        date: new Date(),
        invoiceNumber: invoiceNumber,
        gsttype: contract.gstType.name,
        gstrate: contract.gstRate.percentage,
        totalAmount: totalAmount,
        amounts: amounts,
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        telephone: address.telephone,
        email: address.email,
        website: address.website,
        GSTN: address.GSTN,
        storage: contract.storagetype,
        accountname: bank.accountname,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        IFSC: bank.IFSC,
        accounttype: bank.accounttype,
        foundername: sign.name,
      };
    } else {
      invoiceDetails = {
        invoicename: invoice.name,
        clientName: party.name,
        clientAddress: party.address,
        mobileNumber: party.mobileNumber,
        date: new Date(),
        invoiceNumber: invoiceNumber,

        totalAmount: totalAmount,
        amounts: amounts,
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        telephone: address.telephone,
        email: address.email,
        website: address.website,
        GSTN: address.GSTN,
        storage: contract.storagetype,
        accountname: bank.accountname,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        IFSC: bank.IFSC,
        accounttype: bank.accounttype,
        foundername: sign.name,
      };
    }
    console.log(invoiceDetails);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    generateInvoice(doc, tableData, invoiceDetails);

    doc.end();

    const pdfFilePath = await new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        // The PDF has been saved locally
        console.log("PDF saved locally:", filePath);
        resolve(filePath);
      });

      writeStream.on("error", err => {
        // Handle the error
        console.error("Error saving PDF:", err);
        reject(err);
      });
    });

    return filePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
const formatDate = dateString => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};

exports.getAllContractsByPartyAndStorageforinvoice = async (req, res) => {
  const { partyId, storageId } = req.params;

  try {
    // Find all contracts with the given partyId, storageId, and storagetype='Product'
    const contracts = await Contract.findAll({
      where: {
        partyId,
        storageId,

        status: "Ongoing", // Add this line to filter by storagetype
      },
      include: [
        { model: Location, as: "location", attributes: ["storagename"] },
      ],
    });

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({
        message:
          "No contracts found for the provided partyId, storageId, and storagetype=Product",
      });
    }

    // Extract all details of each contract including storage information
    const contractData = contracts.map(contract => ({
      contractId: contract.id,
      contractname: contract.slno,
      partyId: contract.partyId,
      storageId: contract.storageId,
      storageName: contract.location.storagename,
      storagetype: contract.location.storagetype,
      // Add other contract properties as needed
      renewaldays: contract.renewaldays,
      contractstartdate: contract.contractstartdate,
      Gstapplicable: contract.Gstapplicable,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
      status: contract.status,
      gstrate: contract.gstrate,
      gsttype: contract.gsttype,
      partyId: contract.partyId,
      under: contract.under,
      invoiceno: contract.invoiceno,
    }));

    res.json({ contractData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllInvoicesByContractId = async (req, res) => {
  try {
    const contractId = req.params.contractId;

    // Fetch contract details
    const contract = await Contract.findByPk(contractId);

    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    const invoiceDetails = await Invoice.findAll({
      where: { contractId: contractId },
    });

    return res.status(200).json({ invoiceDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStorageIdByPartymanuf = async (req, res) => {
  try {
    const partyId = req.params.id;

    const party = await userTable.findByPk(partyId);

    if (!party) {
      return res.status(404).json({ error: "Party not found" });
    }
    let under = null;

    if (party.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      under = partyId;
    } else if (party.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      under = party.under;
    }
    // Find all contracts with the given partyId and include associated Location data
    const contracts = await Contract.findAll({
      where: { partyId: under },
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["storagename", "address"],
        },
      ],
    });

    if (!contracts || contracts.length === 0) {
      return res
        .status(404)
        .json({ message: "No contracts found for the provided partyId" });
    }

    // Use a Set to store unique storageIds
    const uniqueStorageIds = new Set();

    // Filter contracts and store unique storage details
    const storageDetails = contracts.reduce(
      (uniqueStorageDetails, contract) => {
        // Check if the storageId is already in the Set
        if (!uniqueStorageIds.has(contract.storageId)) {
          // If not, add it to the Set and push the storage details to the result array
          uniqueStorageIds.add(contract.storageId);
          uniqueStorageDetails.push({
            storageId: contract.storageId,
            storageName: contract.location.storagename,
            address: contract.location.address,
          });
        }
        return uniqueStorageDetails;
      },
      []
    );

    res.json({ storageDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const path = require("path");

// Route for viewing the PDF
exports.viewPDF = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, `../public/uplds/${fileName}`);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate content type for PDF files
    res.contentType("application/pdf");

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // If the file does not exist, send a 404 response
    res.status(404).send("File not found");
  }
};

// Route for downloading the PDF
exports.download = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, `../public/uplds/${fileName}`);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate headers for downloading the file
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/pdf");

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // If the file does not exist, send a 404 response
    res.status(404).send("File not found");
  }
};

const cron = require("node-cron");
const { Op } = require("sequelize");
const varient = require("../models/varient");
const Requisition = require("../models/requisition");

cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      const today = new Date();

      const contracts = await Contract.findAll({
        where: {
          status: {
            [Op.not]: "Closed",
            [Op.eq]: "Ongoing",
          },
        },
      });

      await Promise.all(
        contracts.map(async contract => {
          if (contract.storagetype === "Area") {
            let { nextinvoicedate, renewaldays } = contract;

            // Parse the nextinvoicedate string into a Date object
            let nextInvoiceDate = new Date(nextinvoicedate);

            if (nextInvoiceDate.toDateString() === today.toDateString()) {
              const userId = contract.under;

              const contractProducts = await ContractSpace.findAll({
                where: { contractId: contract.id },
              });

              const storages = await Promise.all(
                contractProducts.map(async store => {
                  const storagespaces = await StoragespaceArea.findAll({
                    where: { contractspace: store.id },
                    include: [
                      {
                        model: SpaceDetails,
                        as: "AreaSpaceDetails",
                      },
                      {
                        model: ContractSpace,
                        as: "contractspac",
                      },
                    ],
                  });
                  return {
                    contractspac: storagespaces[0].contractspac,
                    AreaSpaceDetails: storagespaces.map(
                      space => space.AreaSpaceDetails
                    ),
                  };
                })
              );

              const tableData = storages.map(product => ({
                storagespace: Array.isArray(product.AreaSpaceDetails)
                  ? product.AreaSpaceDetails.map(detail => detail.space).join(
                      ", "
                    )
                  : product.AreaSpaceDetails.space,
                qty: product.contractspac.qty,
                rate: product.contractspac.rate,
                amount: product.contractspac.amount,
              }));

              const pdfFilePath = await generatePDF(
                userId,
                contract.id,
                tableData
              );

              const renewalDays = parseInt(contract.renewaldays, 10);
              const contractStartDate = new Date(today);

              const nextInvoiceDate = new Date(contractStartDate);
              nextInvoiceDate.setDate(
                contractStartDate.getDate() + renewalDays
              );

              (contract.nextinvoicedate = nextInvoiceDate.toISOString()),
                console.log(nextInvoiceDate);
              await contract.save();
            }
          } else {
            const contractProducts = await ContractProduct.findAll({
              where: { contractId: existingContract.id },
            });

            const storages = await Promise.all(
              contractProducts.map(async store => {
                const storagespaces = await Storagespace.findAll({
                  where: { contractproduct: store.id },
                  include: [
                    {
                      model: ContractProduct,
                      as: "contractp",
                    },
                    {
                      model: SpaceDetails,
                      as: "productSpaceDetails",
                    },
                  ],
                });
                return {
                  contractp: storagespaces[0].contractp,
                  productSpaceDetails: storagespaces.map(
                    space => space.productSpaceDetails
                  ),
                };
              })
            );

            const tableData = storages.map(product => ({
              storagespace: Array.isArray(product.productSpaceDetails)
                ? product.productSpaceDetails
                    .map(detail => detail.space)
                    .join(", ")
                : product.productSpaceDetails.space,
              qty: product.contractp.qty,
              rate: product.contractp.rate,
              amount: product.contractp.amount,
            }));

            const pdfFilePath = await generatePDF(
              under,
              existingContract.id,
              tableData
            );

            const renewalDays = parseInt(contract.renewaldays, 10);
            const contractStartDate = new Date(today);

            const nextInvoiceDate = new Date(contractStartDate);
            nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);

            (contract.nextinvoicedate = nextInvoiceDate.toISOString()),
              console.log(nextInvoiceDate);
            await contract.save();
          }
        })
      );

      console.log("Invoice generation completed.");
    } catch (error) {
      console.error("Error generating invoices:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

cron.schedule(
  "*/5 * * * *",
  async () => {
    try {
      // Find all products with quantity 0
      const productsWithZeroQty = await ContractProduct.findAll({
        where: {
          qty: 0,
        },
      });

      // Iterate over each product with 0 quantity
      for (const product of productsWithZeroQty) {
        const contractId = product.contractId;

        // Check if all products for this contract have quantity 0
        const allProductsZeroQty = await ContractProduct.findAll({
          where: {
            contractId: contractId,
            qty: {
              [Op.not]: 0,
            },
          },
        });

        // If no products found with quantity > 0, mark contract status as completed
        if (allProductsZeroQty.length === 0) {
          const contract = await Contract.findOne({
            where: {
              id: contractId,
              status: "Ongoing",
            },
          });

          if (contract) {
            contract.status = "Closed";
            await contract.save();
            console.log(`Contract ${contractId} marked as Completed.`);
          }
        }
      }

      console.log("Products checked.");
    } catch (error) {
      console.error("Error checking products:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

exports.getongoingContrfor = async (req, res) => {
  try {
    const contractId = req.params.contractid;

    let includeAssociations = [
      { association: "location", attributes: ["id", "storagename"] },
      { association: "gstRate", attributes: ["id", "percentage"] },
      { association: "gstType", attributes: ["id", "name"] },
    ];

    // Assuming you have a way to determine the properties of the contract
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: "Contract not found" });
    }

    if (contract.partyidinpartytable === null) {
      includeAssociations.push({
        association: "partyuser",
        attributes: ["id", "name"],
      });
    }

    if (contract.partyId === null) {
      includeAssociations.push({
        association: "partyus",
        attributes: ["id", "name"],
      });
    }

    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: "Ongoing",
      },
      include: includeAssociations,
    });

    if (!draftContract) {
      return res.status(404).json({ error: "Ongoing Contract not found" });
    }

    // ...
    const renewalDays = parseInt(draftContract.renewaldays, 10);

    // Parse contract start date
    const [day, month, year] = draftContract.contractstartdate
      .split("-")
      .map(Number);
    const contractStartDate = new Date(year, month - 1, day); // month is zero-based

    // Calculate next invoice date
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);

    const invoices = await Invoice.findAll({
      where: { contractId: draftContract.id },
      order: [["createdAt", "DESC"]],
    });

    // Extract the first invoice (latest invoice)
    const latestInvoice = invoices.length > 0 ? invoices[0] : null;

    // Count the number of invoices for the contract
    const invoiceCount = invoices.length;

    // ...

    let nextRentalAmount = 0;

    // Check storagetype and quantity conditions
    if (draftContract.storagetype === "Area") {
      // Calculate next rental amount from ContractSpaces for 'Area' storagetype
      const contractSpaces = await ContractSpace.findAll({
        where: { contractId: draftContract.id },
      });

      // Calculate total amount from ContractSpaces
      nextRentalAmount = contractSpaces.reduce((total, space) => {
        return total + space.amount;
      }, 0);

      // If contract status is 'Closed', set nextRentalAmount to 0
      if (draftContract.status === "Closed") {
        nextRentalAmount = 0;
      }
    } else if (draftContract.storagetype === "Product") {
      // Calculate next rental amount for 'Product' storagetype
      const contractSpaces = await ContractProduct.findAll({
        where: { contractId: draftContract.id, qty: { [Op.not]: 0 } },
      });

      // Calculate total amount from ContractSpaces
      nextRentalAmount = contractSpaces.reduce((total, space) => {
        return total + space.amount;
      }, 0);
    }

    // ...

    res.status(200).json({
      contract: draftContract,
      nextInvoiceDate: nextInvoiceDate.toISOString(),
      nextRentalAmount: nextRentalAmount,
      latestInvoice: latestInvoice,
      invoiceCount: invoiceCount,
    });
  } catch (error) {
    console.error("Error fetching ongoing contract with associations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.viewclosedcontractca = async (req, res) => {
  const contractId = req.params.id;

  try {
    // Fetch contract spaces based on the contractId and where contract.status is 'Closed'
    const contractSpaces = await ContractSpace.findAll({
      where: { contractId },
      include: [
        {
          model: Contract, // Assuming you have defined associations properly
          where: {
            status: "Closed",
          },
        },
      ],
    });

    res.json(contractSpaces);
  } catch (error) {
    console.error("Error fetching contract spaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.viewclosedcontractcaproduct = async (req, res) => {
  const contractId = req.params.id;

  try {
    // Fetch contract spaces based on the contractId and where contract.status is 'Closed'
    const contractSpaces = await ContractProduct.findAll({
      where: { contractId },
      include: [
        {
          model: Contract,
          as: "space", // Assuming you have defined associations properly
          where: {
            status: "Closed",
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
    });

    res.json(contractSpaces);
  } catch (error) {
    console.error("Error fetching contract spaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.extractproduct = async (req, res) => {
  try {
    const userId = req.params.under;
    const location = req.params.location;
    const partyid = req.params.partyid;

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
    const party = await userTable.findByPk(partyid);

    if (!party) {
      return res.status(404).json({ error: "User not found" });
    }
    let partyunder = null;

    if (party.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      partyunder = partyid;
    } else if (party.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      partyunder = party.under;
    }

    console.log(partyunder)
    const contractIds = await Contract.findAll({
      where: {
        under,
        storageId: location,
        status: "Ongoing",
        storagetype: "product",
        partyId: partyunder,
      },
    });
    console.log(contractIds);
    // Extract contract IDs from the result
    const ids = contractIds.map(contract => contract.id);

    // Retrieve all contract products based on the extracted contract IDs
    let contractProducts = await ContractProduct.findAll({
      where: {
        contractId: ids,
      },
      include: [
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
    });

    const productMap = new Map();
    contractProducts.forEach(contractProduct => {
      const productName = contractProduct.productid;
      const productDetails = {
        contractproductid: contractProduct.id,
        variant: contractProduct.product.varient?.varient,
        quality: contractProduct.product.quality?.quality,
        size: contractProduct.product.size?.size,
        unit: contractProduct.product.unit?.unit,
        commodity: contractProduct.product.commodity?.commodity,
      };

      const qty = contractProduct.qty; // Assuming 'qty' is the field representing quantity
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

exports.inventoryreportpop = async (req, res) => {
  try {
    const product = req.params.id;
    const userId = req.params.under;
    const location = req.params.location;
    const partyid = req.params.partyid;

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
    const party = await userTable.findByPk(partyid);

    if (!party) {
      return res.status(404).json({ error: "User not found" });
    }
    let partyunder = null;

    if (party.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      partyunder = partyid;
    } else if (party.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      partyunder = user.under;
    }

    const contractIds = await Contract.findAll({
      where: {
        under,
        storageId: location,
        status: "Ongoing",
        storagetype: "product",
        partyId: partyunder,
      },
    });

    const ids = contractIds.map(contract => contract.id);
    // Fetch contract spaces based on the contractId and where contract.status is 'Closed'
    const contractSpaces = await Storagespace.findAll({
      where: {
        contractId: ids,
        productid: product,
      },
      include: [
        {
          model: ContractProduct,
          as: "contractp", // Assuming you have defined associations properly
          include: [
            {
              model: Contract,
              as: "space", // Assuming you have defined associations properly
              where: {
                status: "Ongoing",
              },
            },
          ],
        },
        {
          model: SpaceDetails,
          as: "productSpaceDetails",
        },
      ],
    });

    // Restructuring the data to group contracts and their associated product details
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

    // Extracting the values (contracts with associated product details) from the object and sending as JSON response
    const response = Object.values(contracts);
    res.json(response);
  } catch (error) {
    console.error("Error fetching contract spaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.detailsbutton = async (req, res) => {
  try {
    const userId = req.params.under;
    const location = req.params.location;
    const partyid = req.params.partyid;

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
    const party = await userTable.findByPk(partyid);

    if (!party) {
      return res.status(404).json({ error: "User not found" });
    }
    let partyunder = null;

    if (party.userTypeId === 4) {
      // If user type ID is 3, set under to the user ID
      partyunder = partyid;
    } else if (party.userTypeId === 8) {
      // If user type ID is 5, set under to the user's under value
      partyunder = user.under;
    }

    const contractIds = await Contract.findAll({
      where: {
        under,
        storageId: location,
        status: "Ongoing",
        storagetype: "product",
        partyId: partyunder,
      },
    });

    const ids = contractIds.map(contract => contract.id);

    const contractSpaces = await Storagespace.findAll({
      where: {
        contractId: ids,
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
            varient: contract.product.varient?.varient,
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

    res.json(datas);
  } catch (error) {
    console.error("Error fetching contract spaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.extractproductsformaterialmove = async (req, res) => {
  const userId = req.params.under;
  const location = req.params.location; // Removed extra comma
  const partyids = req.body.partyid; // Assuming partyid is an array of IDs

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
  try {
    const allResults = [];

    for (const partyid of partyids) {
      const contractIds = await Contract.findAll({
        where: {
          under,
          storageId: location,
          status: "Ongoing",
          storagetype: "product",
          partyId: partyid,
        },
        include: [
          {
            model: userTable,
            as: "partyuser",
            attributes: ["id", "name", "mobileNumber"],
          },
        ],
      });

      const ids = contractIds.map(contract => contract.id);

      const contractProducts = await ContractProduct.findAll({
        where: {
          contractId: ids,
        },
        include: [
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
      });

      const partyUser = contractIds[0]?.partyuser; // Get party user info from the first contract (assuming it's the same for all contracts)

      const result = processData(contractProducts, partyUser);
      allResults.push(result);
    }

    res.status(200).json(allResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper function to process contract products and extract relevant information

function processData(contractProducts, partyUser) {
  const productMap = new Map();
  contractProducts.forEach(contractProduct => {
    const productName = contractProduct.productid;
    const productDetails = {
      Productid: contractProduct.productid,
      contractproductid: contractProduct.id,
      variant: contractProduct.product.varient?.varient,
      quality: contractProduct.product.quality?.quality,
      size: contractProduct.product.size?.size,
      unit: contractProduct.product.unit?.unit,
      commodity: contractProduct.product.commodity?.commodity,
    };

    const qty = contractProduct.qty; // Assuming 'qty' is the field representing quantity
    if (productMap.has(productName)) {
      productMap.get(productName).qty += qty;
    } else {
      productMap.set(productName, { qty, ...productDetails });
    }
  });

  const products = Array.from(productMap.values());

  return { partyUser, products };
}

exports.manufactureid = async (req, res) => {
  try {
    const userId = req.params.under;
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

    const contractIds = await Contract.findAll({
      where: {
        under,
        storageId: location,
        status: "Ongoing",
        storagetype: "product",
      },
      include: [
        {
          model: userTable,
          as: "partyuser",
          attributes: ["id", "name", "mobileNumber"],
        },
      ],
    });

    const uniqueParties = [];
    const seenIds = new Set();

    contractIds.forEach(contract => {
      const partyId = contract.partyId;
      if (!seenIds.has(partyId)) {
        seenIds.add(partyId);
        uniqueParties.push({
          id: partyId,
          name: contract.partyuser.name,
          mobileNumber: contract.partyuser.mobileNumber, // Assuming the name attribute is retrieved from the included userTable model
        });
      }
    });

    res.status(200).json(uniqueParties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Define the cron job
cron.schedule(
  "0 0 * * *", // Runs daily at midnight
  async () => {
    try {
      const today = new Date();
      const contractIdsToNotify = []; // Array to store contract IDs for notification

      // Fetch contracts that are ongoing and not closed
      const contracts = await Contract.findAll({
        where: {
          storagetype: "Product",
          status: {
            [Op.not]: "Closed",
            [Op.eq]: "Ongoing",
          },
        },
      });

      // Determine which contracts need to be notified (within 3 days of next invoice date)
      await Promise.all(
        contracts.map(async contract => {
          let { nextinvoicedate } = contract;
          let nextInvoiceDate = new Date(nextinvoicedate);

          // Calculate the difference in milliseconds between nextInvoiceDate and today
          const differenceInMs = nextInvoiceDate.getTime() - today.getTime();

          // Convert milliseconds to days
          const differenceInDays = Math.ceil(
            differenceInMs / (1000 * 60 * 60 * 24)
          );

          if (differenceInDays <= 3) {
            // If differenceInDays is less than or equal to 3, store the contract ID
            contractIdsToNotify.push(contract.id);
          }
        })
      );

      // Process contracts to prepare data for notifications
      const reqSlNoMap = {}; // Map to store data by reqSlNo
      const datas = [];

      for (const contractId of contractIdsToNotify) {
        const contractIds = await Reproduct.findAll({
          where: {
            contractId: contractId,
          },
          include: [
            {
              model: Requisition,
              as: "requtaion",
            },
          ],
        });

        const contractSpaces = await Storagespace.findAll({
          where: {
            contractproduct: contractIds.map(
              contract => contract.contractproductid
            ),
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
              productname: `${contract.product.varient?.varient || ""} ${
                contract.product.commodity?.commodity || ""
              } ${contract.product.size?.size || ""} ${
                contract.product.quality?.quality || ""
              } ${contract.product.unit?.unit || ""}`,
              contractid: contract.space.id,
              contractproductid: contract.id,
              slno: contract.space.slno,
              under: contract.space.under,
              qty: contract.qty,
              spacedetails: item.productDetails.map(detail => ({
                space: detail.space, // Extract space details here
              })),
              requstionid:
                contractIds.find(
                  reproduct => reproduct.contractproductid === contract.id
                )?.requtaion.id || null,
              reqSlNo:
                contractIds.find(
                  reproduct => reproduct.contractproductid === contract.id
                )?.requtaion.slno || null,
            });
          }
        });

        const formattedData = Object.values(productDetailsMap);

        // Group data by reqSlNo
        formattedData.forEach(data => {
          data.contracts.forEach(contract => {
            const reqSlNo = contract.reqSlNo;
            const requstionid = contract.requstionid;
            if (!reqSlNoMap[requstionid]) {
              reqSlNoMap[requstionid] = {};
            }
            if (!reqSlNoMap[requstionid][reqSlNo]) {
              reqSlNoMap[requstionid][reqSlNo] = [];
            }
            reqSlNoMap[requstionid][reqSlNo].push(contract);
          });
        });

        datas.push(formattedData);
      }

      // Construct the response JSON in the desired format
      const responseDatas = [];
      for (const reqId in reqSlNoMap) {
        const requisitions = [];
        for (const reqSlNo in reqSlNoMap[reqId]) {
          const contracts = reqSlNoMap[reqId][reqSlNo];

          const products = contracts.map(contract => ({
            productname: contract.productname, // Assuming you have productName property
            commodity: contract.commodity,
            size: contract.size,
            quality: contract.quality,
            unit: contract.unit,
            contracts: contract.slno, // Add a conditional check here
          }));
          requisitions.push({
            requstionnumber: reqSlNo,
            under: contracts[0].under,
            products: products,
          });
        }
        responseDatas.push(requisitions);
      }

      // Send notifications for each requisition
      for (const requisition of responseDatas) {
        const userId = requisition[0].under;
        const user = await userTable.findByPk(userId);
        let emailMessage = `For the given requisition request: ${requisition[0].requstionnumber}, the following contracts will be auto-renewed in the next 3 days:\n\n`;

        requisition[0].products.forEach((product, productIndex) => {
          emailMessage += `${productIndex + 1}. Product Name: ${
            product.productname
          }\n`;
          emailMessage += `   - Contract: ${product.contracts}\n`;
        });

        // Check if responseDatas.message exists and has a valid value
        if (responseDatas.message) {
          emailMessage += `\n${responseDatas.message}`;
        }

        console.log(emailMessage);

        await sendnotificationByEmail(user.email, emailMessage);
      }

      console.log("Invoice generation completed.");
    } catch (error) {
      console.error("Error generating invoices:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

exports.test = async (req, res) => {
  try {
    const today = new Date();
    const contractIdsToNotify = []; // Array to store contract IDs for notification

    const contracts = await Contract.findAll({
      where: {
        storagetype: "Product",
        status: {
          [Op.not]: "Closed",
          [Op.eq]: "Ongoing",
        },
      },
    });

    await Promise.all(
      contracts.map(async contract => {
        let { nextinvoicedate } = contract;
        let nextInvoiceDate = new Date(nextinvoicedate);

        // Calculate the difference in milliseconds between nextInvoiceDate and today
        const differenceInMs = nextInvoiceDate.getTime() - today.getTime();

        // Convert milliseconds to days
        const differenceInDays = Math.ceil(
          differenceInMs / (1000 * 60 * 60 * 24)
        );

        if (differenceInDays <= 3) {
          // If differenceInDays is less than or equal to 3, store the contract ID
          contractIdsToNotify.push(contract.id);
        }
      })
    );

    const datas = [];
    const reqSlNoMap = {}; // Map to store data by reqSlNo

    // Iterate over contractIdsToNotify and perform additional operations for each contract ID
    for (const contractId of contractIdsToNotify) {
      const contractIds = await Reproduct.findAll({
        where: {
          contractId: contractId, // Assuming requationId is defined elsewhere
        },
        include: [
          {
            model: Requisition,
            as: "requtaion",
          },
        ],
      });

      const contractSpaces = await Storagespace.findAll({
        where: {
          contractproduct: contractIds.map(
            contract => contract.contractproductid
          ),
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
            productname: `${contract.product.varient?.varient || ""} ${
              contract.product.commodity?.commodity || ""
            } ${contract.product.size?.size || ""} ${
              contract.product.quality?.quality || ""
            } ${contract.product.unit?.unit || ""}`,

            contractid: contract.space.id,
            contractproductid: contract.id,
            slno: contract.space.slno,
            under: contract.space.under,
            qty: contract.qty,
            spacedetails: item.productDetails.map(detail => ({
              space: detail.space, // Extract space details here
            })),
            requstionid:
              contractIds.find(
                reproduct => reproduct.contractproductid === contract.id
              )?.requtaion.id || null,
            reqSlNo:
              contractIds.find(
                reproduct => reproduct.contractproductid === contract.id
              )?.requtaion.slno || null,
          });
        }
      });

      const formattedData = Object.values(productDetailsMap);

      // Group data by reqSlNo
      formattedData.forEach(data => {
        data.contracts.forEach(contract => {
          const reqSlNo = contract.reqSlNo;
          const requstionid = contract.requstionid;
          if (!reqSlNoMap[requstionid]) {
            reqSlNoMap[requstionid] = {};
          }
          if (!reqSlNoMap[requstionid][reqSlNo]) {
            reqSlNoMap[requstionid][reqSlNo] = [];
          }
          reqSlNoMap[requstionid][reqSlNo].push(contract);
        });
      });

      datas.push(formattedData);
    }

    // Construct the response JSON in the desired format
    const responseDatas = [];
    for (const reqId in reqSlNoMap) {
      const requisitions = [];
      for (const reqSlNo in reqSlNoMap[reqId]) {
        const contracts = reqSlNoMap[reqId][reqSlNo];

        const products = contracts.map(contract => ({
          productname: contract.productname, // Assuming you have productName property
          commodity: contract.commodity,
          size: contract.size,
          quality: contract.quality,
          unit: contract.unit,
          contracts: contract.slno, // Add a conditional check here
        }));
        requisitions.push({
          requstionnumber: reqSlNo,
          under: contracts[0].under,
          products: products,
        });
      }
      responseDatas.push(requisitions);
    }

    for (const requisition of responseDatas) {
      const userId = requisition[0].under;
      const user = await userTable.findByPk(userId);
      let emailMessage = `For the given requisition request: ${requisition[0].requstionnumber}, the following contracts will be auto-renewed in the next 3 days:\n\n`;

      requisition[0].products.forEach((product, productIndex) => {
        emailMessage += `${productIndex + 1}. Product Name: ${
          product.productname
        }\n`;
        emailMessage += `   - Contract: ${product.contracts}\n`;
      });

      // Check if responseDatas.message exists and has a valid value
      if (responseDatas.message) {
        emailMessage += `\n${responseDatas.message}`;
      }

      console.log(emailMessage);

      await sendnotificationByEmail(user.email, emailMessage);
    }

    // Your existing code...

    res.status(200).json({
      datas: responseDatas,
      message: "Invoice generation completed.",
    });
  } catch (error) {
    console.error("Error generating invoices:", error);
    res
      .status(500)
      .json({ error: "Error sending notification. Please try again later." });
  }
};

exports.getAllInvoicesBymanufacture = async (req, res) => {
  try {
    const partyId = req.params.id;

    const party = await userTable.findByPk(partyId);

    if (!party) {
      return res.status(404).json({ error: "Party not found" });
    }

    let under = null;

    if (party.userTypeId === 4) {
      // If user type ID is 4, set under to the party ID
      under = partyId;
    } else if (party.userTypeId === 8) {
      // If user type ID is 8, set under to the party's under value
      under = party.under;
    }

    const invoices = await Invoice.findAll({
      include: [
        {
          model: Contract,
          as: "inv",
          where: { partyId: under },
        },
      ],
    });

    return res.status(200).json({ invoices });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllInvoicesBycoldstorage = async (req, res) => {
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

    const invoices = await Invoice.findAll({
      include: [
        {
          model: Contract,
          as: "inv",
          where: { under: under },
        },
      ],
    });

    return res.status(200).json({ invoices });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
