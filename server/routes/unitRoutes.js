const router= require('express').Router();
const unitController =require("../Controllers/unitController")

// all units
router.get("/all",unitController.getAllUnit)

// create unit
router.post("/create",unitController.createUnit)

// single unit
router.get("/:id",unitController.singleUnit)

//update unit
router.put("/update/:id",unitController.updateunit)

// delete unit
router.delete("/delete/:id",unitController.deleteUnit)

module.exports= router