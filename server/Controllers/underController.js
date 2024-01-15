const  Under  = require('../models/under');
const userTable = require("../models/user");
exports.createUnder = async (req, res) => {
  try {
    const name  = req.body.name;
    const userId = req.params.id;

    // Find user by ID
    const user = await userTable.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userTypeId === 3) {
      // If user type ID is 3, save the user ID as the 'under' value
      const under = await Under.create({
        name,
        under: userId,
      });

      res.status(201).json({ message: 'Under created successfully', under });
    } else if (user.userTypeId === 5 ) {
      const setunder = user.under;
      const under = await Under.create({
        name,
        under: setunder,
      });

      res.status(201).json({ message: 'Under created successfully', under });
    } else {
      res.status(400).json({ error: 'Invalid user type or missing under value' });
    }
  } catch (error) {
    console.error('Error creating under:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUnderById = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await userTable.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      let under = [];
  
      // Check user type and set under value accordingly
      if (user.userTypeId === 3) {
        // If user type ID is 3, find all Under records where under matches the user ID
        under = await Under.findAll({
          where: {
            under: userId,
          },
        });
      } else if (user.userTypeId === 5) {
        // If user type ID is 5, extract the under value from the user model
        const underValue = user.under;
  
        // Find all Under records where under matches the extracted value
        under = await Under.findAll({
          where: {
            under: underValue,
          },
        });
      }
  
      // Find the Under record where id is 1
      const under1 = await Under.findOne({
        where: {
          id: 1,
        },
      });
  
      if (!under1) {
        return res.status(404).json({ error: 'Under record with id 1 not found' });
      }
  
      res.status(200).json({ under, under1 });
    } catch (error) {
      console.error('Error retrieving under:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  