const router= require('express').Router();
const qualityController =require("../Controllers/qualityController")

// all size data
router.get("/all",qualityController.allQuality)

// create size data
router.post("/create",qualityController.createQuality)

// single size data
router.get("/:id",qualityController.singleQuality)

//update size data
router.put("/update/:id",qualityController.updateQuality)

//delete quality 
router.delete("/delete/:id",qualityController.deleteQuality)

router.get("/:varientId/qualities",qualityController.qualityToVarient)

module.exports= router