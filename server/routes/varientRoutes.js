const router = require("express").Router();
const varientController = require("../Controllers/varientController");
const multer = require("multer");

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
