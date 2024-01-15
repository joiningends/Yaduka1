const router = require("express").Router();
const varientController = require("../Controllers/varientController");
const multer = require("multer");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uplds"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

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
