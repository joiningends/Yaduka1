const userTable = require("../models/user");
const UserUnder = require("../models/userunder");
const { DataTypes, Sequelize } = require("sequelize");
const Party = require("../models/party");
const jwt = require("jsonwebtoken");
const { sendPasswordByEmail } = require('../Controllers/emailController');
const axios = require('axios');
const Contract = require('../models/contract');
const sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
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
        if (admin === '4') {
          userTypeid = 8;
          under = id;
      }
        
        const newUser = await userTable.create({
            name,
            mobileNumber,
            email,
            address,
            terminate,
            companyname,
            under,
            userTypeId: userTypeid,
            uid: 0
          });
  
          // Concatenate 'u' with auto-incremented id
          const uid = "u"+newUser.id;
  
          // Update the user with the generated UID
          await newUser.update({ uid });
  

       

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
              userTypeId: 4,
              uid:0,
            });
    
            // Concatenate 'u' with auto-incremented id
            const uid = "u"+newUser.id;
    
            // Update the user with the generated UID
            await newUser.update({ uid });
     

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
                userTypeId:5,
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

        // Check if usertypeid is 3 to set 'under' accordingly
        if (admin === '1') {
            userTypeid = 3;
        }

        // Generate a random password (you can use a more secure method if needed)
       //const passwords = generateRandomPassword();
        //const password = await bcrypt.hash(passwords, 10);

        // Create the user with specific fields
        const newUser = await userTable.create({
            name,
            mobileNumber,
            email,
            address,
            terminate,
            companyname,
            userTypeId: userTypeid,
            //password,
            //passwords,
            
        });

        // Concatenate 'u' with auto-incremented id
       

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
          userTypeId: 4,
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
  const updatedUserData = req.body;

  try {
    const user = await userTable.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user data
    await user.update(updatedUserData);

    // Fetch the updated user data from the database
    const updatedUser = await userTable.findOne({ where: { id: userId } });

    // Send the updated user data in the response
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

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

exports.getUsersByUserType = async (req, res) => {
  try {
    const userType = 4; // Assuming you want users with userTypeId 6

    const users = await userTable.findAll({
      where: {
        userTypeId: parseInt(userType),
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by user type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getPartiesByUserIds = async (req, res) => {
  try {
    const userId = req.params.id;

    
    const user2Id = 4;

    
    const partyResults = await Party.findAll({
      
    });

    // Fetch users from User table where userTypeId is 6 or 4 AND under is userId
    const userResults = await userTable.findAll({
      where: {
        [Sequelize.Op.and]: [
          { userTypeId:  user2Id },
          { under: userId }
        ]
      },
    });

    const combinedResults = [...partyResults, ...userResults];

    // Filter out duplicates based on mobile number
    const uniqueResults = Array.from(new Set(combinedResults.map(result => result.mobileNumber)))
      .map(mobileNumber => {
        return combinedResults.find(result => result.mobileNumber === mobileNumber);
      });

    res.status(200).json(uniqueResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getAllPartiesAndUsers = async (req, res) => {
  try {
    // Fetch parties and users with userTypeId = 4
    const parties = await Party.findAll();
    const users = await userTable.findAll({
      where: {
        userTypeId: 4
      }
    });

    // Create an array to store unique entries
    const uniqueEntries = [];

    // Find parties without a matching user based on the mobile number
    const partiesWithoutMatchingUser = parties.filter(party => !users.some(user => user.mobileNumber === party.mobileNumber));

    // Push parties and users into uniqueEntries, ensuring no duplicates
    partiesWithoutMatchingUser.forEach(party => {
      // Create a new object with the properties of 'party' and set 'name' property
      const modifiedParty = {
        id:party.id,
        companyname: party.businessName,
        brandMarka: party.brandMarka,
        image: party.image,
        notes: party.notes,
        contactPerson: party.contactPerson,
        mobileNumber: party.mobileNumber,
        address: party.address,
        slNo: party.slNo,
        isBlacklist: party.isBlacklist,
        isActive: party.isActive,
        createdAt: party.createdAt,
        updatedAt: party.updatedAt,
        name: party.contactPerson
      };
      
      uniqueEntries.push(modifiedParty);
    });

    users.forEach(user => {
      uniqueEntries.push(user);
    });

    // Return the unique entries or appropriate response
    if (uniqueEntries.length > 0) {
      res.status(200).json(uniqueEntries);
    } else {
      res.status(404).json({ message: "No unique entries found." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching parties and users." });
  }
};










exports.loginUser = async (req, res) => {
  const { mobileNumber, Otp, password } = req.body;

  try {
    const user = await userTable.findOne({
      where: { mobileNumber },
    });

    if (!user) {
      return res.status(400).send("User not found");
    }

    let token;
    let role;

    if (user && Otp === Otp && user.userTypeId === 3 && bcrypt.compareSync(password, user.password)) {
      const secret = process.env.secret;
      token = jwt.sign(
        {
          userId: user.id,
          role: "coldstorageadmin",
        },
        secret,
        { expiresIn: "1d" }
      );
      role = "coldstorageadmin";
    } else if (user && Otp === Otp && user.userTypeId === 5 && bcrypt.compareSync(password, user.password)) {
      const secret = process.env.secret;
      token = jwt.sign(
        {
          userId: user.id,
          role: "coldstorageemployee",
        },
        secret,
        { expiresIn: "1d" }
      );
      role = "coldstorageemployee";
    } else if (user && Otp === Otp && user.userTypeId === 8 && bcrypt.compareSync(password, user.password)) {
      const secret = process.env.secret;
      token = jwt.sign(
        {
          userId: user.id,
          role: "manufectureemployee",
        },
        secret,
        { expiresIn: "1d" }
      );
      role = "manufectureemployee";
    } else if (user && Otp === Otp && user.userTypeId === 4 && bcrypt.compareSync(password, user.password)) {
      const secret = process.env.secret;
      token = jwt.sign(
        {
          userId: user.id,
          role: "manufectureadmin",
        },
        secret,
        { expiresIn: "1d" }
      );
      role = "manufectureadmin";
    } else {
      return res.status(400).send("Login failed");
    }

    return res.status(200).send({
      user: user.mobileNumber,
      id: user.id,
      role: role,
      token: token,
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
};



function generateOTP(length) {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}


exports.sendotp = async (req, res) => {
  try {
    const generatedOtp = generateOTP(4); // Assuming generateOTP is defined elsewhere
    const { mobileNumber } = req.body; // Assuming mobileNumber is provided in the request body
    const user = await userTable.findOne({
      where: { mobileNumber: mobileNumber }
    });
    if(!user){
      return res.status(400).send("Mobile number not exsit...");
    }
    const message = `OTP for Login in the YadukaPortal is ${generatedOtp}`;

    // Send OTP to the user's mobile number
    const response = await axios.post('https://api.textlocal.in/send/', null, {
      params: {
        apiKey: process.env.TEXTLOCAL_API_KEY,
        numbers: mobileNumber,
        message: message,
        sender: 'TrSeed' 
      }
    });

    console.log(response.data);
    if (response.data.status === 'success') {
      // Save the OTP in the database
      await saveOtpInDatabase(mobileNumber, generatedOtp);
      console.log('OTP sent and saved successfully');
      res.send('OTP sent and saved successfully');
    } else {
      // Handle case where OTP sending failed
      console.error('Failed to send OTP:', response.data);
      res.status(500).send('Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP');
  }
};
const saveOtpInDatabase = async (mobileNumber, otp) => {
  try {
    // Check if the user exists in the database
    const user = await userTable.findOne({
      where: { mobileNumber: mobileNumber }
    });

    // If the user exists, save the OTP for that user
    if (user) {
      // Update the user's OTP field in the database
      user.otp = otp.toString();
      await user.save();
      console.log('OTP saved successfully for user:', user.id);
    } else {
      console.error('User not found with mobile number:', mobileNumber);
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error saving OTP in database:', error);
    throw new Error('Error saving OTP in database');
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, enteredOtp } = req.body; // Assuming mobileNumber and enteredOtp are provided in the request body

    const user = await userTable.findOne({
      where: { mobileNumber: mobileNumber }
    });

    if (user && enteredOtp === user.otp) {
      // OTP verification successful
      user.otp = '0'; // Clear the OTP value after successful verification
      await user.save();
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      // OTP verification failed
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};



exports.setPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;

    // Find the user by ID
    const user = await userTable.findOne({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const Password = await bcrypt.hash(newPassword, 10);
    user.password = Password;
    
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error setting password:', error);
    res.status(500).json({ error: 'Error setting password' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { mobileNumber } = req.params;

    // Find the user by ID
    const user = await userTable.findOne({
      where: {
        mobileNumber:mobileNumber
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Error fetching user by ID' });
  }
};

exports.userById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Assuming 'User' is your model for user data
    const user = await userTable.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getUsersparty = async (req, res) => {
  const userId = req.params.id;
  let under;
  try {
    const user = await userTable.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userTypeId === 3) {
      // If user type ID is 3, set under to the user ID
      under = userId;
    } else if (user.userTypeId === 5) {
      // If user type ID is 5, set under to the user's under value
      under = user.under;
    }
    const party = await UserUnder.findAll({
      where: {
        underValues: under // Assuming underValues corresponds to the user ID
      },
      include: [{ model: userTable, as: 'party' }] // Including the associated userTable (party)
    });

    res.status(200).json(party);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};
exports.getUsersWithType4 = async (req, res) => {
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

    // Fetch unique party details associated with contracts
    const partyDetails = await Contract.findAll({
      where: { under: under },
      include: [{
        model: userTable,
        as: 'partyuser',
        foreignKey: 'partyId',
        attributes: [
          'id',
          [sequelize.fn('MAX', sequelize.col('partyuser.name')), 'partyuser_name'],
          [sequelize.fn('MAX', sequelize.col('partyuser.mobileNumber')), 'partyuser_mobileNumber'],
          [sequelize.fn('MAX', sequelize.col('partyuser.companyname')), 'partyuser_companyname']
        ],
        allowNull: true
      }],
      attributes: [], // Exclude contract attributes
      raw: true, // Get raw data without Sequelize model instances
      group: ['partyuser.id'] // Group by party user ID to get unique party details
    });
    res.status(200).json(partyDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};


