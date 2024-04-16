const Invoice = require("../models/invoice");


exports.getInvoicesByContractId = async (req, res) => {
  try {
    const { contractId } = req.params;

    // Retrieve invoices from the database for the specified contractId
    const invoices = await Invoice.findAll({
      where: {
        contractId: contractId,
      },
    });

    // Respond with the retrieved invoices
    res.status(200).json(invoices);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
