const router = require("express").Router();
const commodityController = require("../Controllers/commodityController");

const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uplds');
  },
  filename: function(req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype] || ''; // Default to empty string if extension not found
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE // Set maximum file size
  }
});




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
