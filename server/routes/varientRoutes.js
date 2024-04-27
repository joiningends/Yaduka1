const router = require("express").Router();
const varientController = require("../Controllers/varientController");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

// Configure AWS SDK
aws.config.update({
  region: "ap-south-1" 
});

const s3 = new aws.S3();

// Create an instance of multer and configure it
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "yasukaimages",
    contentType: multerS3.AUTO_CONTENT_TYPE,
   
    key: function(req, file, cb) {
      const fileName = file.originalname.split(" ").join("-");
     cb(null, `${fileName}-${Date.now()}`);
    }
  }),
  limits: {
    fileSize: MAX_FILE_SIZE // Set maximum file size
  }
});

console.log(upload)
router.get("/all", varientController.allVarient);

//get commodity varient

router.get("/commodity/:commodityId", varientController.commodityVarient);

//create varient

router.post("/create", upload.single("image"),varientController.createVarient);

//update varient

router.put("/update/:id", upload.single("image"),varientController.updateVarient);

// get single varient

router.get("/:id", varientController.singleVarient);

// delete varient

router.delete("/delete/:id", varientController.deleteVarient);

//download varient image
router.get("/files/:name", varientController.downloadFiles);

router.get("/:commodityId/varients", varientController.getCommodityToVarient);

module.exports = router;
