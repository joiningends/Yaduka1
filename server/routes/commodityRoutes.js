const router = require("express").Router();
const commodityController = require("../Controllers/commodityController");
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
