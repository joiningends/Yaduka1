const router = require("express").Router();
const varientController = require("../Controllers/varientController");
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
      cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
  });
  const upload = multer({ storage });



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
