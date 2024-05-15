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
router.get(
  "/manufactureid/:id/:location",
  requisitionController.getmanufactureId
);

router.post(
  "/requstion/:id/:location",
  requisitionController.getRequisitionfortabledatapending
);
router.post(
  "/requstion/complete/:id/:location",
  requisitionController.getRequisitionfortabledatacomplete
);
router.get(
  "/manufactureid/complete/:id/:location",
  requisitionController.getmanufactureIdcompleted
);

router.get(
  "/material/completed/:id",
  requisitionController.getRequisitionIdcomplet
);
router.get(
  "/mat/pending/:id",
  requisitionController.getRequisitionsBycoldstorageadmi
);

router.get(
  "/mat/complete/:id",
  requisitionController.getRequisitionsBycoldstorageadmicomplete
);
module.exports = router;
