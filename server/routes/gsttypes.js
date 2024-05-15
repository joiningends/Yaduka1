const express = require("express");
const router = express.Router();
const gstTypeController = require("../Controllers/gsttypeController");

// POST route to create a new GstType
router.post("/", gstTypeController.createGstType);

// GET route to retrieve all GstTypes
router.get("/", gstTypeController.getAllGstTypes);

module.exports = router;
