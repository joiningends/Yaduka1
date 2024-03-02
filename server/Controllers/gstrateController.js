const  GstRate  = require('../models/gstrate'); // Adjust the path as needed


exports.createGstRate = async (req, res) => {
  try {
    
    const  percentage  = req.body.percentage;

    
    const newGstRate = await GstRate.create({
      percentage,
    });

    
    res.status(201).json(newGstRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllGstRates = async (req, res) => {
  try {
    
    const allGstRates = await GstRate.findAll();

    
    res.status(200).json(allGstRates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
