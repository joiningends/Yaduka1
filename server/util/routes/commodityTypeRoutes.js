const router = require("express").Router();
const commodityTypeController = require("../Controllers/commodityTypeController");

//get all commodity Type
router.get("/all", commodityTypeController.getCommodityTypes);

//create commodity type
router.post("/create", commodityTypeController.createCommodityTypes);

// single commodity Type
router.get("/:id", commodityTypeController.singleCommodityType);

// update commodity Type
router.put("/update/:id", commodityTypeController.updateCommodityType);

// delete roles
router.delete("/delete/:id", commodityTypeController.deleteCommodityType);

module.exports = router;
