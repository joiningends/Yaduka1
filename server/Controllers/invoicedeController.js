const Address = require('../models/address');
const BankDetails = require('../models/bankdetails');
const Signature = require('../models/signeture');


exports.createCompany = async (req, res) => {
    try {
        const newCompany = await Address.create(req.body);
        res.status(201).json(newCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};





exports.createSignature = async (req, res) => {
    try {
        const newSignature = await Signature.create(req.body);
        res.status(201).json(newSignature);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



exports.createBankDetail = async (req, res) => {
    try {
        const { accountname, bankName, accountNumber, IFSC, accounttype } = req.body;

        // Create a new bank detail
        const newBankDetail = await BankDetails.create({
            accountname,
            bankName,
            accountNumber,
            IFSC,
            accounttype
        });

        // Respond with the newly created bank detail
        res.status(201).json({ success: true, data: newBankDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllBankDetails = async (req, res) => {
    try {
        const bankDetails = await BankDetails.find();
        res.status(200).json(bankDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllSignatures = async (req, res) => {
    try {
        const signatures = await Signature.find();
        res.status(200).json(signatures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
