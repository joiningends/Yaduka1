const router = require("express").Router();
const productController = require("../Controllers/productController");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configure AWS SDK
aws.config.update({
  region: "ap-south-1",
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "yasukaimages",
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: function (req, file, cb) {
      const fileName = file.originalname.split(" ").join("-");
      cb(null, `${fileName}-${Date.now()}`);
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE, // Set maximum file size
  },
});
// all product data
router.get("/all", productController.allProduct);
router.get("/all1/:commodityId", productController.allProduct1);

// create product data
router.post("/create", upload.single("image"), productController.createProduct);

// single product data
router.get("/:id", productController.singleProduct);

//update product data
router.put("/update/:id", productController.updateProduuct);

//delete product
router.delete("/delete/:id", productController.deleteProduct);
router.get("/all1/variant/:VarientId", productController.allProductvariant);
module.exports = router;
