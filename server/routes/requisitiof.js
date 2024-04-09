// routes/requisitions.js
const express = require("express");
const router = express.Router();
const requisitionController = require("../Controllers/requisitionController");

router.post("/create/:partyid", requisitionController.createRequisition);

router.get(
  "/getByPartyId/:partyid",
  requisitionController.getRequisitionsByPartyId
);
router.get(
  "/completed/:partyid",
  requisitionController.getRequisitionsByPartycompleted
);

router.get("/getById/:requisitionId", requisitionController.getRequisitionById);
router.get("/:id", requisitionController.getRequisitionId);
router.get("/complete/:id", requisitionController.getRequisitionIdcompleted);
router.put("/", requisitionController.updateDeliveryQty);
router.put("/request/qty", requisitionController.updateRequireQty);
router.get("/tabledata/:requstion", requisitionController.detailsbuttonedit);
module.exports = router;
