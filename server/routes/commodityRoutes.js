const router = require("express").Router();
const commodityController = require("../Controllers/commodityController");

const multer = require("multer");

const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

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

// Create an instance of multer and configure it
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

router.get("/all", commodityController.allcommodity);
router.get("/all1", commodityController.allcommodity1);

//create commodity

router.post(
  "/create",
  upload.single("image"),
  commodityController.createCommodity
);

//update commodity

router.put(
  "/update/:id",
  upload.single("image"),
  commodityController.updateCommodity
);

// get single commodity

router.get("/:id", commodityController.singleCommodity);

// delete commodity

router.delete("/delete/:id", commodityController.deleteCommodity);

//download commodity image
router.get("/files/:name", commodityController.downloadFiles);

module.exports = router;
