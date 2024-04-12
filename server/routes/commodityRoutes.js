const router = require("express").Router();
const commodityController = require("../Controllers/commodityController");
const multer = require("multer");

// Configure multer storage
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('Invalid image type');
  
      if (isValid) {
        uploadError = null;
      }
      cb(uploadError, 'public/uplds');
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
  });
  const upload = multer({ storage });
//get all commodity

router.get("/all",commodityController.allcommodity);
router.get("/all1",commodityController.allcommodity1);

//create commodity

router.post("/create",upload.single("image"), commodityController.createCommodity);

//update commodity

router.put("/update/:id",upload.single("image"), commodityController.updateCommodity);

// get single commodity

router.get("/:id",commodityController.singleCommodity)

// delete commodity

router.delete("/delete/:id", commodityController.deleteCommodity);

//download commodity image
router.get("/files/:name", commodityController.downloadFiles);




module.exports = router;
