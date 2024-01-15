const userTable = require("../models/user");
const UserUnder = require("../models/userunder");

const Party = require("../models/party");

const { sendPasswordByEmail } = require('../Controllers/emailController');

exports.createUser = async (req, res) => {
    const admin = req.params.usertypeid;
    const id = req.params.admin;

    try {
        const {
            name,
            mobileNumber,
            email,
            address,
            terminate,
            companyname,
        } = req.body;

        let userTypeid;
        let under;

        // Check if usertypeid is 3 to set 'under' accordingly
        if (admin === '3') {
            userTypeid = 5;
            under = id;
        }

        // Generate a random password (you can use a more secure method if needed)
        const password = generateRandomPassword();

        // Create the user with specific fields
        const newUser = await userTable.create({
            name,
            mobileNumber,
            email,
            address,
            terminate,
            companyname,
            under,
            userTypeId: userTypeid,
            password,
        });

        // Send the auto-generated password to the user's email
        await sendPasswordByEmail(email, password);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

// Function to generate a random password
function generateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}




exports.create = async (req, res) => {
  const usertypeid = req.params.usertypeid;
  const id = req.params.admin;
  let under; // Initialize 'under' variable
  
  try {
      const {
          name,
          mobileNumber,
          email,
          address,
          terminate,
          companyname,
          
      } = req.body;
      const password = generateRandomPassword();
      // Check if usertypeid is 3 to set 'under' accordingly
      if (usertypeid === '3') {
          under = id;
      } else if (usertypeid === '5') {
          const user = await userTable.findOne({
              where: {
                  userTypeId: usertypeid,
                  id: id,
              },
          });
          if (user) {
              under = user.under; // Assuming you want to associate with the user's id
          }
      }

      // Check if the user already exists in userTable
      const existingUser = await userTable.findOne({
          where: {
              name,
              mobileNumber,
              email,
              address,
              terminate,
              companyname,
              userTypeId: 6,
              password,
          },
      });

      if (existingUser) {
          // User already exists, check if association is present in UserUnder
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

          res.status(200).json(existingUser);
      } else {
          // Create a new user and save the association in UserUnder table
          const newUser = await userTable.create({
              name,
              mobileNumber,
              email,
              address,
              terminate,
              companyname,
              userTypeId: 6,
              password,
          });

          await UserUnder.create({
              partyid: newUser.id,
              underValues: under,
          });

          res.status(201).json(newUser);
      }
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
  }
};





exports.getUsersUnderId = async (req, res) => {
    const userId = req.params.id;

    try {
        const usersUnderId = await userTable.findAll({
            where: {
                under: userId,
            },
        });

        res.status(200).json(usersUnderId);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.getparty = async (req, res) => {
    const { userId } = req.params; // Assuming you get these values from req.params
  
    try {
      const userTableRecord = await userTable.findOne({
        where: {
          id: userId,
        },
      });
  
      if (userTableRecord) {
        let underValueToUse = userTableRecord.under;
  
        // If under value is null or 0, use id instead
        if (underValueToUse === null || underValueToUse === 0) {
          underValueToUse = userTableRecord.id;
        }
  
        const parties = await UserUnder.findAll({
          where: {
            underValues: underValueToUse, 
          },
          include: [
            {
              model: userTable, 
              as: 'valueofunder', 
              attributes: ['id', 'name'], // Include attributes you want to retrieve
            },
          ],
        });
  
        // Send the parties as a response
        res.status(200).json(parties);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error retrieving parties:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.createColdstorageadmin = async (req, res) => {
    const admin = req.params.usertypeid;
    

    try {
        const {
            name,
            mobileNumber,
            email,
            address,
            terminate,
            companyname,
        } = req.body;

        let userTypeid;
        let under;

        // Check if usertypeid is 3 to set 'under' accordingly
        if (admin === '1') {
            userTypeid = 3;
            
        }
        

        // Generate a random password (you can use a more secure method if needed)
        const password = generateRandomPassword();

        // Create the user with specific fields
        const newUser = await userTable.create({
            name,
            mobileNumber,
            email,
            address,
            terminate,
            companyname,
            
            userTypeId: userTypeid,
            password,
        });

        // Send the auto-generated password to the user's email
        await sendPasswordByEmail(email, password);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};


exports.searchByMobileNumber = async(req, res)=> {
  const mobileNumberToSearch = req.params.mobileNumber;

  try {
    // Search in the "party" model by mobile number
    const partyRecord = await Party.findOne({
      where: {
        mobileNumber: mobileNumberToSearch,
      },
    });

    if (partyRecord) {
      // If a party with the specified mobile number is found
      res.json({ record: partyRecord, type: "party" });
    } else {
      // If no party with the specified mobile number is found, check in "userTable"
      const userRecord = await userTable.findOne({
        where: {
          mobileNumber: mobileNumberToSearch,
          userTypeId: 6,
        },
      });

      if (userRecord) {
        // If a user with the specified mobile number and userTypeId 6 is found
        res.json({ record: userRecord, type: "user" });
      } else {
        // If neither party nor user is found
        res.json({ record: null, type: null });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


// Get User by ID
exports.getemployeeby =  async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userTable.findByPk(userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update User by ID
exports.updateemployee = async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body; // Assuming you send updated data in the request body

  try {
    const finduser = await userTable.findOne({
      where: {
        id: userId,
      },
    });

    if (finduser) {
      const newuser = await finduser.update(updatedUserData);
      res.status(200).json(newuser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Delete User by ID
exports.delectemployee =  async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedRowCount = await userTable.destroy({
      where: { id: userId },
    });

    if (deletedRowCount > 0) {
      res.status(204).send(); // No content (successful deletion)
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};







