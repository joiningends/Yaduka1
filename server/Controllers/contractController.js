const Contract = require("../models/contract");
const userTable = require("../models/user");
const ContractSpace = require("../models/contractspace");
const Invoice = require("../models/invoice");
const Product = require("../models/product");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const ContractProduct = require("../models/contractproduct");
//const { Op } = require('sequelize');
const Variant = require("../models/varient");
const Quality = require("../models/quality");
const Size = require("../models/size");
const Unit = require("../models/unit");
const Commodity = require("../models/commodity")
const Sequelize = require("sequelize");
const SpaceDetails = require("../models/SpaceDetails");
const  Location  = require('../models/location');
const party = require("../models/party");
const UserUnder = require("../models/userunder");
const GstType = require("../models/gsttype");
const  GstRate  = require('../models/gstrate');

const {
  sendWhatsAppMessage,sendWhatsAppMessageMedia,
  getSentMessageCount,
  getSentMessages,
  
} = require("../Controllers/whatsappController");

exports.createContract = async (req, res) => {
  const userId = req.params.id;
  const user = await userTable.findByPk(userId);
  const dynamicyear = new Date().getFullYear();

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

    if (typeof partyId === 'undefined' || partyId === null) {
      // If partyId is not provided or null, fetch data from party table using partyidinpartytable
      const partyData = await party.findByPk(partyidinpartytable);

      if (!partyData) {
        return res.status(404).json({ error: 'Party data not found' });
      }

      // Check if the user already exists
      existingUser = await userTable.findOne({
        where: {
          
          mobileNumber: partyData.mobileNumber,
          
          
        },
      });
console.log(existingUser)
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
      status: 'Draft',
    });

    // Update slno using the newly created contract
    const slno = `CTR/${dynamicyear}/${newContract.id}`;

    // Update the newContract with the slno and save it to the database
    newContract.slno = slno;
    await newContract.save();

    // Respond with the newly created contract
    res.status(201).json(newContract);

  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getAllDraftContracts = async (req, res) => {
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
    const draftContracts = await Contract.findAll({
      where: {
        status: 'Draft',
        under:under
      },
      include: [
        { association: 'location', attributes: ['id', 'storagename'] },
        { association: 'gstRate', attributes: ['id', 'percentage'] },
        { association: 'gstType', attributes: ['id', 'name'] },
       
        // Add more associations as needed
      ],
    });

    
      
    res.status(200).json(draftContracts);
  } catch (error) {
    console.error('Error fetching draft contracts with associations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getDraftContractById = async (req, res) => {
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

    const contractId = req.params.contractid;

    let includeAssociations = [
      { association: 'location', attributes: ['id', 'storagename'] },
      { association: 'gstRate', attributes: ['id', 'percentage'] },
      { association: 'gstType', attributes: ['id', 'name'] }
    ];

    // Assuming you have a way to determine the properties of the contract
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.partyidinpartytable === null) {
      includeAssociations.push({ association: 'partyuser', attributes: ['id', 'name'] });
    }

    if (contract.partyId === null) {
      includeAssociations.push({ association: 'partyus', attributes: ['id', 'name'] });
    }

    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: 'Draft',
        under: under,
      },
      include: includeAssociations,
    });

    if (!draftContract) {
      return res.status(404).json({ error: 'Draft Contract not found' });
    }

    res.status(200).json(draftContract);
  } catch (error) {
    console.error('Error fetching draft contract by ID with associations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateContract = async (req, res) => {
  try {
    const contractId = req.params.id;
    const userId = req.params.userid;
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

    

    const existingContract = await Contract.findByPk(contractId);

    if (!existingContract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const renewalDays = parseInt(existingContract.renewaldays, 10);

    // Parse contract start date
    const [day, month, year] = existingContract.contractstartdate.split('-').map(Number);
    const contractStartDate = new Date(year, month - 1, day); // month is zero-based
    
    // Calculate next invoice date
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);
    
    const add = existingContract.invoiceno + 1;
    await existingContract.update({
      invoiceno : add ,
      status:'Ongoing',
      nextinvoicedate: nextInvoiceDate.toISOString(),
    });
    const { storagespaces } = req.body;

    // Add new ContractSpaces
    if (storagespaces && Array.isArray(storagespaces)) {
      await Promise.all(
        storagespaces.map(async (space) => {
          // Check if a space with the same details already exists for the contract
          const existingSpace = await ContractSpace.findOne({
            where: {
              contractId: existingContract.id,
              storagespace: space.storagespace|| null
              
            },
          });

          // Create a new ContractSpace if it doesn't exist
          if (!existingSpace) {
            await ContractSpace.create({
              ...space,
              contractId: existingContract.id,
            });
          }
        })
      );
    }

    const contractProducts = await ContractSpace.findAll({
      where: { contractId: existingContract.id },
      include: [{ model: SpaceDetails, as: 'storagespaces' }]
    });

    // Extract data from contractProducts and create tableData
    const tableData = contractProducts.map(product => ({
      storagespace: product.storagespaces.space, // Extract space details
      qty: product.qty, // Assuming quantity is always 1
      rate: product.rate, // Assuming rate is already available in contractProducts
      amount: product.amount // Assuming amount is already available in contractProducts
    }));
console.log(tableData)
    const pdfFilePath = await generatePDF(under, existingContract.id, tableData);

    res.status(200).json(existingContract);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 





const generateInvoiceNumber = async (userId, currentYear) => {
  // Get the count of invoices generated for the user in the current year
  const count = await Invoice.count({
    where: {
      userId: userId,
      createdAt: {
        [Op.between]: [new Date(`${currentYear}-01-01`), new Date(`${currentYear}-12-31`)],
      },
    },
  });

  // Increment the count and format it with leading zeros
  const invoiceNumber = `INV_${currentYear.toString().slice(-2)}_${(count + 1).toString().padStart(4, '0')}`;

  return invoiceNumber;
};

exports.updateContractforproduct = async (req, res) => {
  try {
    const contractId = req.params.id;
    const userId = req.params.userid;
    const user = await userTable.findByPk(userId);
    console.log(contractId);

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

    const existingContract = await Contract.findByPk(contractId);

    if (!existingContract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    const renewalDays = parseInt(existingContract.renewaldays, 10);

    // Parse contract start date
    const [day, month, year] = existingContract.contractstartdate.split('-').map(Number);
    const contractStartDate = new Date(year, month - 1, day); // month is zero-based
    
    // Calculate next invoice date
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);
    
    const add = existingContract.invoiceno + 1;
    await existingContract.update({
      invoiceno: add,
      status: 'Ongoing',
      nextinvoicedate: nextInvoiceDate.toISOString(),
    });

    const { storagespaces } = req.body;

    // Add new ContractSpaces
    if (storagespaces && Array.isArray(storagespaces)) {
      await Promise.all(
        storagespaces.map(async (space) => {
          // Check if a space with the same details already exists for the contract
          const existingSpace = await ContractProduct.findOne({
            where: {
              contractId: existingContract.id,
              storagespace: space.storagespace || null
            },
          });

          // Create a new ContractSpace if it doesn't exist
          if (!existingSpace) {
            const newContractProduct = await ContractProduct.create({
              ...space,
              contractId: existingContract.id,
            });
          }
        })
      );
    }

    // Fetch contract products including space details using eager loading
    const contractProducts = await ContractProduct.findAll({
      where: { contractId: existingContract.id },
      include: [{ model: SpaceDetails, as: 'storagespac' }]
    });

    // Extract data from contractProducts and create tableData
    const tableData = contractProducts.map(product => ({
      storagespace: product.storagespac.space, // Extract space details
      qty: product.qty, // Assuming quantity is always 1
      rate: product.rate, // Assuming rate is already available in contractProducts
      amount: product.amount // Assuming amount is already available in contractProducts
    }));
console.log(tableData)
    const pdfFilePath = await generatePDF(under, existingContract.id, tableData);

    res.status(200).json(existingContract);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 



exports.getongoingContrforarea = async (req, res) => {
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

    const contractId = req.params.contractid;

    let includeAssociations = [
      { association: 'location', attributes: ['id', 'storagename'] },
      { association: 'gstRate', attributes: ['id', 'percentage'] },
      { association: 'gstType', attributes: ['id', 'name'] }
    ];

    // Assuming you have a way to determine the properties of the contract
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.partyidinpartytable === null) {
      includeAssociations.push({ association: 'partyuser', attributes: ['id', 'name'] });
    }

    if (contract.partyId === null) {
      includeAssociations.push({ association: 'partyus', attributes: ['id', 'name'] });
    }


    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: 'Ongoing',
        under: under,
      },
      include:includeAssociations
    });

    if (!draftContract) {
      return res.status(404).json({ error: 'Ongoing Contract not found' });
    }

    // ...
    const renewalDays = parseInt(draftContract.renewaldays, 10);

    // Parse contract start date
    const [day, month, year] = draftContract.contractstartdate.split('-').map(Number);
    const contractStartDate = new Date(year, month - 1, day); // month is zero-based
    
    // Calculate next invoice date
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);
    


    const invoices = await Invoice.findAll({
      where: { contractId: draftContract.id },
      order: [['createdAt', 'DESC']],
    });

    // Extract the first invoice (latest invoice)
    const latestInvoice = invoices.length > 0 ? invoices[0] : null;

    // Count the number of invoices for the contract
    const invoiceCount = invoices.length;

    // ...


let nextRentalAmount = 0;

// Check storagetype and quantity conditions
if (draftContract.storagetype === 'Area') {
  // Calculate next rental amount from ContractSpaces for 'Area' storagetype
  const contractSpaces = await ContractSpace.findAll({
    where: { contractId: draftContract.id },
  });

  // Calculate total amount from ContractSpaces
  nextRentalAmount = contractSpaces.reduce((total, space) => {
    return total + space.amount;
  }, 0);

  // If contract status is 'Closed', set nextRentalAmount to 0
  if (draftContract.status === 'Closed') {
    nextRentalAmount = 0;
  }
} else if (draftContract.storagetype === 'Product') {
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
    console.error('Error fetching ongoing contract with associations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllongoinContracts = async (req, res) => {
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
    const draftContracts = await Contract.findAll({
      where: {
        status: 'Ongoing',
        under:under
      },
      include: [
        { association: 'location', attributes: ['id', 'storagename'] },
        { association: 'gstRate', attributes: ['id', 'percentage'] },
        { association: 'gstType', attributes: ['id', 'name'] },
        { association: 'partyuser', attributes: ['id', 'name'] } 
        // Add more associations as needed
      ],
    });
    

    
      
    res.status(200).json(draftContracts);
  } catch (error) {
    console.error('Error fetching draft contracts with associations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    });

    res.status(200).json(contractProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getContractSpacesByContractId = async (req, res) => {
  try {
    const contractId = req.params.contractId;

    // Fetch contract spaces based on the contractId and where contract.status is not 'Closed'
    const contractSpaces = await ContractSpace.findAll({
      where: { contractId },
      include: [{
        model: Contract,
        where: {
          id: contractId,
          status: {
            [Op.not]: 'Closed',
          },
        },
      },
        {
          model: SpaceDetails,
          as: 'storagespaces',
          attributes: ['space'], // Include only the desired attribute
        },
      ],
    });

    res.status(200).json(contractSpaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateContractStatus = async (req, res) => {
  try {
    const contractId = req.params.contractId;
    const  status = req.body.status;

    // Update the status of the contract
    const updatedContract = await Contract.update(
      { status },
      { where: { id: contractId } }
    );

    if (updatedContract[0] === 1) {
      res.status(200).json({ message: 'Contract status updated successfully' });
    } else {
      res.status(404).json({ error: 'Contract not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getcompleteContractById = async (req, res) => {
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

    const contractId = req.params.contractid;

    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: 'Closed',
        under: under,
      },
      include: [
        { association: 'location', attributes: ['id', 'storagename'] },
        { association: 'gstRate', attributes: ['id', 'percentage'] },
        { association: 'gstType', attributes: ['id', 'name'] },
        { association: 'partyuser', attributes: ['id', 'name'] },
        // Add more associations as needed
      ],
    });

    if (!draftContract) {
      return res.status(404).json({ error: 'Draft Contract not found' });
    }

    res.status(200).json(draftContract);
  } catch (error) {
    console.error('Error fetching draft contract by ID with associations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getStorageIdByPartyId = async (req, res) => {
  const partyId = req.params.id;

  try {
    // Find all contracts with the given partyId and include associated Location data
    const contracts = await Contract.findAll({
      where: { partyId,
        storagetype: 'Product',
       },
      include: [{ model: Location, as: 'location', attributes: ['storagename'] }],
    });

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({ message: 'No contracts found for the provided partyId' });
    }

    // Extract storage data from the contracts
    const storageData = contracts.map(contract => ({
      storageId: contract.storageId,
      storageName: contract.location.storagename, // Access storagename through the association
    }));

    res.json({ storageData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
        storagetype: 'Product',
        status:'Ongoing' // Add this line to filter by storagetype
        
      },
      include: [{ model: Location, as: 'location', attributes: ['storagename'] }],
    });

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({ message: 'No contracts found for the provided partyId, storageId, and storagetype=Product' });
    }

    // Extract all details of each contract including storage information
    const contractData = contracts.map(contract => ({
      contractId: contract.id,
      contractname:contract.slno,
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
    res.status(500).json({ message: 'Internal server error' });
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
    });
    res.json(contractProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStorageIdByParty = async (req, res) => {
  const partyId = req.params.id;
  const userId = req.params.userId;
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

  try {
    // Find all contracts with the given partyId and include associated Location data
    const contracts = await Contract.findAll({
      where: { partyId, under: under },
      include: [{ model: Location, as: 'location', attributes: ['storagename', 'address'] }],
    });

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({ message: 'No contracts found for the provided partyId' });
    }

    // Use a Set to store unique storageIds
    const uniqueStorageIds = new Set();

    // Filter contracts and store unique storage details
    const storageDetails = contracts.reduce((uniqueStorageDetails, contract) => {
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
    }, []);

    res.json({ storageDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





exports.getongoingContrforparty = async (req, res) => {
  try {
    

    const contractId = req.params.contractid;

    let includeAssociations = [
      { association: 'location', attributes: ['id', 'storagename'] },
      { association: 'gstRate', attributes: ['id', 'percentage'] },
      { association: 'gstType', attributes: ['id', 'name'] }
    ];

    // Assuming you have a way to determine the properties of the contract
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.partyidinpartytable === null) {
      includeAssociations.push({ association: 'partyuser', attributes: ['id', 'name'] });
    }

    if (contract.partyId === null) {
      includeAssociations.push({ association: 'partyus', attributes: ['id', 'name'] });
    }


    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: 'Ongoing',
        
      },
      include:includeAssociations
    });

    if (!draftContract) {
      return res.status(404).json({ error: 'Ongoing Contract not found' });
    }

    // ...
    const renewalDays = parseInt(draftContract.renewaldays, 10);

    // Parse contract start date
    const [day, month, year] = draftContract.contractstartdate.split('-').map(Number);
    const contractStartDate = new Date(year, month - 1, day); // month is zero-based
    
    // Calculate next invoice date
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);
    


    const invoices = await Invoice.findAll({
      where: { contractId: draftContract.id },
      order: [['createdAt', 'DESC']],
    });

    // Extract the first invoice (latest invoice)
    const latestInvoice = invoices.length > 0 ? invoices[0] : null;

    // Count the number of invoices for the contract
    const invoiceCount = invoices.length;

    // ...


let nextRentalAmount = 0;

// Check storagetype and quantity conditions
if (draftContract.storagetype === 'Area') {
  // Calculate next rental amount from ContractSpaces for 'Area' storagetype
  const contractSpaces = await ContractSpace.findAll({
    where: { contractId: draftContract.id },
  });

  // Calculate total amount from ContractSpaces
  nextRentalAmount = contractSpaces.reduce((total, space) => {
    return total + space.amount;
  }, 0);

  // If contract status is 'Closed', set nextRentalAmount to 0
  if (draftContract.status === 'Closed') {
    nextRentalAmount = 0;
  }
} else if (draftContract.storagetype === 'Product') {
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
    console.error('Error fetching ongoing contract with associations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getAllContractsByPartyId = async (req, res) => {
  try {
    const partyId = req.params.id;

    // Find the party by ID
    const party = await userTable.findByPk(partyId);

    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    // Find all contracts associated with the party
    const contracts = await Contract.findAll({
      where: { partyId: partyId ,
        status: 'Ongoing',
      
      }, // Assuming the foreign key in the Contract model is partyId
    
    include: [
      { association: 'location', attributes: ['id', 'storagename'] },
      { association: 'gstRate', attributes: ['id', 'percentage'] },
      { association: 'gstType', attributes: ['id', 'name'] },
      { association: 'partyuser', attributes: ['id', 'name'] },
      // Add more associations as needed
    ],
  });

    res.status(200).json(contracts);
  } catch (error) {
    console.error('Error fetching contracts by party ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllContractsByPartyIdcompleted = async (req, res) => {
  try {
    const partyId = req.params.id;

    // Find the party by ID
    const party = await party.findByPk(partyId);

    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    // Find all contracts associated with the party
    const contracts = await Contract.findAll({
      where: { partyId: partyId,
        status: 'Closed',
      }, // Assuming the foreign key in the Contract model is partyId
      include: [
        { association: 'location', attributes: ['id', 'storagename'] },
        { association: 'gstRate', attributes: ['id', 'percentage'] },
        { association: 'gstType', attributes: ['id', 'name'] },
        { association: 'partyuser', attributes: ['id', 'name'] },
        // Add more associations as needed
      ],
    });
  

    res.status(200).json(contracts);
  } catch (error) {
    console.error('Error fetching contracts by party ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};














// Function to generate the header of the invoice
function generateHeaders(doc,invoiceDetails) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const textWidth = doc.widthOfString('Tax Invoice');
  const textX = (doc.page.width - textWidth) / 2;

  doc.fontSize(12)
    .text('Tax Invoice', textX, 50)
    .moveDown(1); // Add 1 line of spacing after the title

  // Add logo
  const logoPath = 'public/uplds/logoimage.jpeg'; // Adjust the path to your logo image
  doc.image(logoPath, 50, 50, { width: 50 });

  // Add space between logo and company details
  doc.text('', 50, 150); // Add space after the logo
  doc.fontSize(12).text(`${invoiceDetails.name}`, 50, 90);
  doc.fontSize(10).text(`${invoiceDetails.street}`, 50, 105)
     .text(`${invoiceDetails.city}`, 50, 120)
     .text(`${invoiceDetails.state}`, 50, 135)
     .moveDown(1) // Add space before the telephone
     .text(`Telephone: ${invoiceDetails.telephone}`, 50, 160)
     .text(`E-mail: ${invoiceDetails.email}`, 50, 175)
     .text(`Website: ${invoiceDetails.website}`, 50, 190)
     .moveDown(1)
     doc.font('Helvetica-Bold').fontSize(10)
     .text(`GSTN: ${invoiceDetails.GSTN}`, 50, 210)
  doc.font('Helvetica').fontSize(10)
  .text(`Invoice For: ${invoiceDetails.storage}`, 50, 225);
    
  doc.fontSize(10)
     .text(`Invoice Number: ${invoiceDetails.invoiceNumber}`, 300, 120)
     .text(`Invoice Date: ${currentDate}`, 300, 140)
     .moveDown(); // Add space after the invoice details

  const boxTop = 150;
  const boxLeft = 300;
  const boxWidth = 250;
  const boxHeight = 90;
  doc.strokeColor('black').lineWidth(1).rect(boxLeft, boxTop, boxWidth, boxHeight).stroke();
   
  // Set text color to black
  doc.fillColor('black');

  
  doc.font('Helvetica-Bold').fontSize(10) 
     .text('Invoiced To:', boxLeft + 5, boxTop + 5);
  doc.font('Helvetica').fontSize(10) // Change back to default font and size
     .text(`Client Name: ${invoiceDetails.clientName}`, boxLeft + 5, boxTop + 20)
     .text(`MobileNumber: ${invoiceDetails.mobileNumber} `, boxLeft + 5, boxTop + 35)
     
     .text(`Client Address: ${invoiceDetails.clientAddress} `, boxLeft + 5, boxTop + 45)
     
     .text(' ', boxLeft + 5, boxTop + 50);
}



function generateTables(doc, tableData) {
  if (!tableData || !Array.isArray(tableData)) {
    throw new Error('Tables data is invalid or not provided.');
  }

  const tableTop = 280;
  const rowHeight = calculateRowHeight(fontSize, padding);

  // Table headers
  doc.font('Helvetica-Bold').fontSize(12);
  doc.text('Storagespace', 60, tableTop);
  doc.text('Qty', 200, tableTop);
  doc.text('Rate', 320, tableTop);
  doc.text('Amount', 410, tableTop, { width: 90, align: 'right' });

  // Function to generate a single row of the table
  function generateTableRow(y, rowData) {
    doc.font('Helvetica').fontSize(10)
      .text(rowData.storagespace, 60, y)
      .text(rowData.qty, 200, y)
      .text(rowData.rate, 320, y)
      .text(rowData.amount, 410, y, { width: 90, align: 'right' });
  }

  // Table rows
  let yPos = tableTop + 20;

  tableData.forEach(row => {
    if (yPos + rowHeight > doc.page.height - 50) { // Check if next row exceeds page height
      doc.addPage(); // Add a new page if the next row will exceed the available space
      yPos = 50; // Reset yPos for the new page
      // Add table headers again on the new page
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text('Storagespace', 60, yPos);
      doc.text('Qty', 200, yPos);
      doc.text('Rate', 320, yPos);
      doc.text('Amount', 410, yPos, { width: 90, align: 'right' });
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





function generateFooters(doc, tableData,invoiceDetails) {
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

  
    if (invoiceDetails.gsttype === 'CGST&SGST') {
      const CGST = (invoiceDetails.gstrate)/2;
      const SGST = (invoiceDetails.gstrate)/2;
      
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text(`Total Fee: ${invoiceDetails.totalAmount}`, 420, footerTop + 5);
      doc.text('Total Taxable Value', 50, footerTop + 25);
      doc.text('GST on Above:', 50, footerTop + 45);
      doc.text(`${invoiceDetails.gstrate}%`, 420, footerTop + 45);
      doc.text('CGST', 50, footerTop + 60);
      doc.text(`${CGST}%`, 420, footerTop + 60);
      doc.text('SGST', 50, footerTop + 75);
      doc.text(`${SGST}%`, 420, footerTop + 75);
      doc.text('Total Invoice Value', 50, footerTop + 90);
      doc.text(`${invoiceDetails.amounts}`, 420, footerTop + 90);
    } else {
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text(`Total Fee: ${invoiceDetails.totalAmount}`, 420, footerTop + 5);
      doc.text('Total Taxable Value', 50, footerTop + 25);

      doc.text('GST on Above:', 50, footerTop + 45);
      doc.text(`${invoiceDetails.gstrate}%`, 420, footerTop + 45);
      doc.text('IGST', 50, footerTop + 60);
      doc.text(`${invoiceDetails.gstrate}%`, 420, footerTop + 60);
      doc.text('Total Invoice Value', 50, footerTop + 75);
      doc.text(`${invoiceDetails.amounts}`, 420, footerTop + 75);
    }
  
    
    
  
  const boxLeft = 40;
  const boxTop = footerTop + 110;
  const boxWidth = 250;
  const boxHeight = 100;
  doc.rect(boxLeft, boxTop, boxWidth, boxHeight).stroke();

  // Add banking details inside the box
  doc.font('Helvetica-Bold').fontSize(10)
    .text('Banking Details:', boxLeft + 5, boxTop + 5)
    .font('Helvetica').fontSize(8)
    .text(`Account name: ${invoiceDetails.accountname}`, boxLeft + 5, boxTop + 20)
    .text(`Bank name: ${invoiceDetails.bankName}`, boxLeft + 5, boxTop + 35)
    .text(`Account Number: ${invoiceDetails.accountNumber}`, boxLeft + 5, boxTop + 50)
    .text(`Account Type: ${invoiceDetails.accounttype}`, boxLeft + 5, boxTop + 65)
    .text(`IFSC Code:${invoiceDetails.IFSC}`, boxLeft + 5, boxTop + 80);

  const tboxLeft = 400;
  const tboxWidth = 150;
  const termsBoxTop = footerTop + 120;
  const termsBoxHeight = 70;
  doc.rect(tboxLeft, termsBoxTop, tboxWidth, termsBoxHeight).stroke();

  doc.font('Helvetica-Bold').fontSize(10)
    .text('Terms of Payment:', tboxLeft + 5, termsBoxTop + 5);

  // Add image
  const imagePath = 'public/uplds/mysign.png'; // Adjust the path to your image
  doc.image(imagePath, tboxLeft + 10, termsBoxTop + 20, { width: 50 });
  doc.font('Helvetica-Oblique').fontSize(10) // Set font to italic
    .text('for', 410, footerTop + 200); // Add italic text "for"

  doc.font('Helvetica').fontSize(10)
    .text(`${invoiceDetails.foundername}`, 410, footerTop + 210)
    .text('Founder and Director', 410, footerTop + 220);
}





function generateInvoice(doc, tableData,invoiceDetails) {
  doc.strokeColor('lightblue').lineWidth(3);

  // Draw border around the entire page
  doc.rect(20, 20, 570, 750).stroke();
  
  // Generate headers
  generateHeaders(doc,invoiceDetails);
  
  
  doc.moveTo(50, 200);


  // Generate tables
  generateTables(doc,tableData);
// Move down to create space

  // Generate footers
  generateFooters(doc,tableData,invoiceDetails);
}






const Address = require('../models/address');
const BankDetails = require('../models/bankdetails');
const Signature = require('../models/signeture');


const generatePDF = async (userId, existingContract,tableData) => {
  try {
    const currentYear = new Date().getFullYear();
    const invoiceNumber = await generateInvoiceNumber(userId, currentYear);
const fileName = `${invoiceNumber}.pdf`
    const filePath = `public/uplds/${invoiceNumber}.pdf`;

    
    const contract = await Contract.findByPk(existingContract, {
      include: [
        
        { model: GstRate, as: 'gstRate', allowNull: true },
        { model: GstType, as: 'gstType', allowNull: true }
      ]
    });

    if (!contract) {
      throw new Error('Contract not found');
    }
    const party = await userTable.findByPk(contract.partyId);

    if (!party) {
      throw new Error('User not found');
    }
    const totalAmount = tableData.reduce((total, rowData) => {
      return total + rowData.amount;
    }, 0);
    const amounts = totalAmount +(totalAmount * contract.gstRate.percentage)/100;

    const invoice = await Invoice.create({
      userId,
      contractId: contract.id,
      name: `${invoiceNumber}`,
      amount:amounts,
      filePath :fileName
    });
    
    const addresses = await Address.findAll();
    const banks = await BankDetails.findAll();
    const signs = await Signature.findAll();
    const address = addresses[0];
   
    

   
    const bank =banks[0];

    

    // Assuming you want to use the first address in the list
    const sign =signs[0];

    const invoiceDetails = {
      invoicename: invoice.name,
      clientName: party.name,
      clientAddress: party.address,
      mobileNumber: party.mobileNumber,
      date: new Date(),
      invoiceNumber:invoiceNumber,
      gsttype:contract.gstType.name,
      gstrate:contract.gstRate.percentage,
      totalAmount:totalAmount,
      amounts:amounts,
      name:address.name,
      street:address.street,
      city:address.city,
      state:address.state,
      telephone:address.telephone,
      email:address.email,
      website:address.website,
      GSTN:address.GSTN,
      storage:contract.storagetype,
      accountname:bank.accountname,
      bankName:bank.bankName,
      accountNumber:bank.accountNumber,
      IFSC:bank.IFSC,
      accounttype:bank.accounttype,
      foundername:sign.name
    };

    console.log(invoiceDetails)
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);
    
    
    generateInvoice(doc, tableData,invoiceDetails);

    doc.end();

    
const pdfFilePath = await new Promise((resolve, reject) => {
  writeStream.on("finish", () => {
    // The PDF has been saved locally
    console.log("PDF saved locally:", filePath);
    resolve(filePath);
  });

  writeStream.on("error", (err) => {
    // Handle the error
    console.error("Error saving PDF:", err);
    reject(err);
  });
});

// Construct the media URL for WhatsApp
const media_url = `https://appointments.inspirononline.com/${filePath}`;

// Send WhatsApp message with the PDF attachment
sendWhatsAppMessageMedia(
  party.mobileNumber,
  `Thank you for your payment. Please find the attached invoice.`,
  media_url
);

return filePath;
} catch (error) {
console.error("Error generating PDF:", error);
throw error;
}
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}



exports.getAllContractsByPartyAndStorageforinvoice = async (req, res) => {
  const { partyId, storageId } = req.params;

  try {
    // Find all contracts with the given partyId, storageId, and storagetype='Product'
    const contracts = await Contract.findAll({
      where: {
        partyId,
        storageId,
        
        status:'Ongoing' // Add this line to filter by storagetype
        
      },
      include: [{ model: Location, as: 'location', attributes: ['storagename'] }],
    });

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({ message: 'No contracts found for the provided partyId, storageId, and storagetype=Product' });
    }

    // Extract all details of each contract including storage information
    const contractData = contracts.map(contract => ({
      contractId: contract.id,
      contractname:contract.slno,
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
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllInvoicesByContractId = async (req, res) => {
  try {
    const contractId = req.params.contractId;

    // Fetch contract details
    const contract = await Contract.findByPk(contractId);

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

   
      const invoiceDetails = await Invoice.findAll({
        where: { contractId: contractId }
      });

      return res.status(200).json({ invoiceDetails });
    
    
  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





exports.getStorageIdByPartymanuf = async (req, res) => {
  const partyId = req.params.id;
  
  try {
    // Find all contracts with the given partyId and include associated Location data
    const contracts = await Contract.findAll({
      where: { partyId,  },
      include: [{ model: Location, as: 'location', attributes: ['storagename', 'address'] }],
    });

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({ message: 'No contracts found for the provided partyId' });
    }

    // Use a Set to store unique storageIds
    const uniqueStorageIds = new Set();

    // Filter contracts and store unique storage details
    const storageDetails = contracts.reduce((uniqueStorageDetails, contract) => {
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
    }, []);

    res.json({ storageDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const path = require('path');

// Route for viewing the PDF
exports.viewPDF = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, `../public/uplds/${fileName}`);
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate content type for PDF files
    res.contentType('application/pdf');
    
    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // If the file does not exist, send a 404 response
    res.status(404).send('File not found');
  }
};

// Route for downloading the PDF
exports.download = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, `../public/uplds/${fileName}`);
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate headers for downloading the file
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/pdf');
    
    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // If the file does not exist, send a 404 response
    res.status(404).send('File not found');
  }
};


const cron = require('node-cron');
const { Op } = require('sequelize');
cron.schedule('0 0 * * *', async () => {
  try {
    // Find contracts with storage type "Area" and status not equal to "Closed" and status "Ongoing"
    const contracts = await Contract.findAll({
      where: {
        
        status: {
          [Op.not]: 'Closed',
          [Op.eq]: 'Ongoing'
        }
      }
    });

    // Generate invoices for each contract
    await Promise.all(contracts.map(async (contract) => {
      // Extract nextinvoicedate and renewalDays from the contract object
      let { nextinvoicedate, renewalDays } = contract;

      // Split nextinvoicedate into year, month, and day components
      const [year, month, day] = nextinvoicedate.split('-').map(Number);

      // Create a Date object for the contract start date
      const contractStartDate = new Date(year, month - 1, day); // month is zero-based

      // Calculate next invoice date
      const nextInvoiceDate = new Date(contractStartDate);
      nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);

      // Create a new invoice
      const invoiceNumber = generateInvoiceNumber(); // Implement your function to generate invoice number
      const userId = contract.under;
      const invoice = await Invoice.create({
        userId,
        contractId: contract.id,
        name: `${invoiceNumber}`,
        // Add other invoice properties as needed
        invoicedate: nextInvoiceDate // Save the calculated next invoice date in the invoice
      });

      console.log(`Invoice created for contract ${contract.id}: ${invoice.name}`);

      // Update the contract with the new next invoice date
      contract.nextinvoicedate = nextInvoiceDate;
      await contract.save();
    }));

    console.log('Invoice generation completed.');
  } catch (error) {
    console.error('Error generating invoices:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata' // Specify your timezone, e.g., 'Asia/Kolkata'
});


cron.schedule('*/5 * * * *', async () => {
  try {
    // Find all products with quantity 0
    const productsWithZeroQty = await ContractProduct.findAll({
      where: {
        qty: 0
      }
    });

    // Iterate over each product with 0 quantity
    for (const product of productsWithZeroQty) {
      const contractId = product.contractId;

      // Check if all products for this contract have quantity 0
      const allProductsZeroQty = await ContractProduct.findAll({
        where: {
          contractId: contractId,
          qty: {
            [Op.not]: 0
          }
        }
      });

      // If no products found with quantity > 0, mark contract status as completed
      if (allProductsZeroQty.length === 0) {
        const contract = await Contract.findOne({
          where: {
            id: contractId
          }
        });

        if (contract) {
          contract.status = 'Closed';
          await contract.save();
          console.log(`Contract ${contractId} marked as Completed.`);
        }
      }
    }

    console.log('Products checked.');
  } catch (error) {
    console.error('Error checking products:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata'
});



exports.getongoingContrfor = async (req, res) => {
  try {
   

    const contractId = req.params.contractid;

    let includeAssociations = [
      { association: 'location', attributes: ['id', 'storagename'] },
      { association: 'gstRate', attributes: ['id', 'percentage'] },
      { association: 'gstType', attributes: ['id', 'name'] }
    ];

    // Assuming you have a way to determine the properties of the contract
    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.partyidinpartytable === null) {
      includeAssociations.push({ association: 'partyuser', attributes: ['id', 'name'] });
    }

    if (contract.partyId === null) {
      includeAssociations.push({ association: 'partyus', attributes: ['id', 'name'] });
    }


    const draftContract = await Contract.findOne({
      where: {
        id: contractId,
        status: 'Ongoing',
        
      },
      include:includeAssociations
    });

    if (!draftContract) {
      return res.status(404).json({ error: 'Ongoing Contract not found' });
    }

    // ...
    const renewalDays = parseInt(draftContract.renewaldays, 10);

    // Parse contract start date
    const [day, month, year] = draftContract.contractstartdate.split('-').map(Number);
    const contractStartDate = new Date(year, month - 1, day); // month is zero-based
    
    // Calculate next invoice date
    const nextInvoiceDate = new Date(contractStartDate);
    nextInvoiceDate.setDate(contractStartDate.getDate() + renewalDays);
    


    const invoices = await Invoice.findAll({
      where: { contractId: draftContract.id },
      order: [['createdAt', 'DESC']],
    });

    // Extract the first invoice (latest invoice)
    const latestInvoice = invoices.length > 0 ? invoices[0] : null;

    // Count the number of invoices for the contract
    const invoiceCount = invoices.length;

    // ...


let nextRentalAmount = 0;

// Check storagetype and quantity conditions
if (draftContract.storagetype === 'Area') {
  // Calculate next rental amount from ContractSpaces for 'Area' storagetype
  const contractSpaces = await ContractSpace.findAll({
    where: { contractId: draftContract.id },
  });

  // Calculate total amount from ContractSpaces
  nextRentalAmount = contractSpaces.reduce((total, space) => {
    return total + space.amount;
  }, 0);

  // If contract status is 'Closed', set nextRentalAmount to 0
  if (draftContract.status === 'Closed') {
    nextRentalAmount = 0;
  }
} else if (draftContract.storagetype === 'Product') {
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
    console.error('Error fetching ongoing contract with associations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};