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
const path = require("path");
app.use("/public/uplds", express.static(__dirname + "/public/uplds"));


//Routes

const usersRoutes = require("./routes/users");
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
 const gstrateRoutes = require("./routes/gstrates")
 const gsttypeRoutes = require("./routes/gsttypes") 
 const contractsRoutes = require("./routes/contracts")
const requisitionRoutes = require("./routes/requisitiof")
const allinvRoutes = require("./routes/allinvoice")




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
  app.use(`${api}/gstrates`, gstrateRoutes)
app.use(`${api}/gsttypes`, gsttypeRoutes)
app.use(`${api}/contracts`, contractsRoutes)
app.use(`${api}/ref`, requisitionRoutes)
app.use(`${api}/allinvoice`, allinvRoutes)

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
const Contract = require("./models/contract");
const GstType = require("./models/gsttype");
const  GstRate  = require('./models/gstrate');
const ContractSpace = require("./models/contractspace");
const ContractProduct = require("./models/contractproduct");
const Invoice = require("./models/invoice");
const Requisition = require("./models/requisition");
const Reproduct = require("./models/reproduct");
const party = require("./models/party");
const Address = require('./models/address');
const BankDetails = require('./models/bankdetails');
const Signature = require('./models/signeture');
const Storagespace = require("./models/storagespace");
const StoragespaceArea = require("./models/storagespacearea");
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

Contract.belongsTo(userTable, { foreignKey: 'under', as: 'underadmin' });
Contract.belongsTo(Location, { foreignKey: 'storageId', as: 'location' });
Contract.belongsTo(GstRate, { foreignKey: 'gstrate', as: 'gstRate', allowNull: true }); 
Contract.belongsTo(GstType, { foreignKey: 'gsttype', as: 'gstType', allowNull: true });
//Contract.belongsTo(userTable, { foreignKey: 'partyId', as: 'user' });
Contract.belongsTo(userTable, { foreignKey: 'partyId', as: 'partyuser', allowNull: true });
Contract.belongsTo(party, { foreignKey: 'partyidinpartytable', as: 'partyus',allowNull: true });
Contract.hasMany(ContractSpace, { as: 'spaces', foreignKey: 'contractId' });
ContractSpace.belongsTo(Contract, { foreignKey: 'contractId' });
//ContractSpace.belongsTo(SpaceDetails, { foreignKey: 'storagespace', as: 'storagespaces' });
Contract.hasMany(ContractProduct, { as: 'space', foreignKey: 'contractId' });
ContractProduct.belongsTo(Contract, { as: 'space', foreignKey: 'contractId' });
Storagespace.belongsTo(SpaceDetails, { foreignKey: 'productspaces', as: 'productSpaceDetails' });
StoragespaceArea.belongsTo(SpaceDetails, { foreignKey: 'Areaspaces', as: 'AreaSpaceDetails' });

Storagespace.belongsTo(ContractProduct, { foreignKey: 'contractproduct', as: 'contractp' });
Storagespace.belongsTo(Contract, { as: 'contractdet', foreignKey: 'contractId' });
StoragespaceArea.belongsTo(ContractSpace, { foreignKey: 'contractspace', as: 'contractspac' });
Storagespace.belongsTo(product, { foreignKey: 'productid', as: 'products' });
ContractProduct.belongsTo(product, { foreignKey: 'productid', as: 'product' });
Contract.hasMany(Invoice, { as: 'invoice', foreignKey: 'contractId' });
userTable.hasMany(Invoice, { as: 'admin', foreignKey: 'userId' });

//Requisition.belongsTo(userTable, { foreignKey: 'partyId', as: 'partyuser', allowNull: true });
//Requisition.belongsTo(party, { foreignKey: 'partyidinpartytable', as: 'partyus',allowNull: true });
Requisition.belongsTo(userTable, { foreignKey: "partyid", as: "part" });
Reproduct.belongsTo(Contract, { foreignKey: 'contractId',as: "conf" });
Reproduct.belongsTo(Location, { foreignKey: 'storageId', as: 'locatios' });
Reproduct.belongsTo(ContractProduct, { foreignKey: 'contractproductid', as: 'contractproduct' });
Requisition.hasMany(Reproduct, { as: 'reproducts', foreignKey: 'requationId' });
Requisition.belongsTo(userTable, { foreignKey: "underValues", as: "valueofunde" });

Requisition.belongsTo(Location, { foreignKey: 'storageId', as: 'locatio' });

Reproduct.belongsTo(Requisition, { as: 'requtaion', foreignKey: 'requationId' });

const _dirname = path.dirname("");
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));
app.get("/*", (_, res) => {
  res.sendFile(path.join(buildPath, "index.html")),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    };
});
sequelize.sync()
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
