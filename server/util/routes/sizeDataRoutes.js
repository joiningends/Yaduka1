const router= require('express').Router();
const sizeDataController =require("../Controllers/sizeDataController")

// all size data
router.get("/all",sizeDataController.allSizeData)

// create size data
router.post("/create",sizeDataController.createSizeData)

// single size data
router.get("/:id",sizeDataController.singleSizeData)

//update size data
router.put("/update/:id",sizeDataController.updateSizeData)

//delete size data
router.delete("/delete/:id",sizeDataController.deleteSize)
router.get("/:varientId/sizes",sizeDataController.getSizeToVarient)


module.exports= router