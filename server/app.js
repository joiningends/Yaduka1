// app.js

require("dotenv/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const Sequelize = require('sequelize');
const cors = require("cors");
const sequelize = require("./util/database");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(morgan("tiny"));



//Routes


const commodityTypeRoutes = require("./routes/commodityTypeRoutes");
const commodityRoutes = require("./routes/commodityRoutes");

const varientRoutes = require("./routes/varientRoutes");

const sizeDataRoutes = require("./routes/sizeDataRoutes");
const qualityRoutes = require("./routes/qualityRoutes");
const productRoutes = require("./routes/productRoutes");
const unitRoutes = require("./routes/unitRoutes");
const spaceTypesRoutes = require("./routes/spacetypes");
const underRoutes = require("./routes/unders");
const locationRoutes = require("./routes/locations")
  // Routes
  const usersRoutes = require("./routes/users");
  const api = process.env.API_URL;
  app.use(`${api}/users`, usersRoutes);
  app.use(`${api}/commodityType`, commodityTypeRoutes);
  app.use(`${api}/commodity`, commodityRoutes);
 
  app.use(`${api}/varient`, varientRoutes);
  
  
  app.use(`${api}/size`, sizeDataRoutes);
  app.use(`${api}/quality`, qualityRoutes);
  app.use(`${api}/product`, productRoutes);
  app.use(`${api}/unit`, unitRoutes);
  app.use(`${api}/spacetype`, spaceTypesRoutes)
  app.use(`${api}/under`, underRoutes)
  app.use(`${api}/location`, locationRoutes)
// Import your User model
const userTable = require("./models/user");
const UserUnder = require("./models/userunder");

const commodityType = require("./models/commodityType");
const commodity = require("./models/commodity");


const varient = require("./models/varient");


const size = require("./models/size");
const quality = require("./models/quality");
const product = require("./models/product");
const unit = require("./models/unit");
const SpaceType = require('./models/spacetype');

const  Location = require("./models/location");
const SpaceDetails = require("./models/SpaceDetails");
const Under = require("./models/under");

commodity.belongsTo(commodityType);

//varient
varient.belongsTo(commodity);
size.belongsTo(varient);

// Quality
quality.belongsTo(varient);

//product
product.belongsTo(varient);
product.belongsTo(quality);
product.belongsTo(size);
product.belongsTo(unit);

product.belongsTo(commodity);
// In UserUnder model
UserUnder.belongsTo(userTable, { foreignKey: "partyid", as: "party" });
UserUnder.belongsTo(userTable, { foreignKey: "underValues", as: "valueofunder" });

SpaceDetails.belongsTo(SpaceType, { foreignKey: 'type' });
 Location.hasMany(SpaceDetails, { as: 'spaceDetails', foreignKey: 'locationId' });
 SpaceDetails.belongsTo(Location, { foreignKey: 'locationId' });
SpaceDetails.belongsTo(Under, { foreignKey: 'under', as: "undertype" });
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronization complete.');

  

    // Start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });
  