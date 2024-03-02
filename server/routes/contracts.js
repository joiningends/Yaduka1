const express = require("express");
const router = express.Router();
const contractController = require("../Controllers/contractController");

// POST route to create a new contract
router.post("/:id", contractController.createContract);
router.get("/:id/draft", contractController.getAllDraftContracts);
router.get("/:id/draft/:contractid", contractController.getDraftContractById);
router.put("/draft/:id/:userid", contractController.updateContract);
router.put("/draft/:id/:userid/product", contractController.updateContractforproduct);
router.get("/onging/:id/:contractid", contractController.getongoingContrforarea);
router.get("/:id/ongoinf", contractController.getAllongoinContracts);
router.get('/contract-products/:contractId', contractController.getContractProductsByContractId);
router.get('/contract-area/:contractId', contractController.getContractSpacesByContractId);
router.put('/:contractId/status', contractController.updateContractStatus);
router.get('/completed/:id', contractController.getContractSpacesByContractId);
router.get('/storage/:id', contractController.getStorageIdByPartyId);
router.get('/storags/:partyId/:storageId', contractController.getAllContractsByPartyAndStorage);
router.get('/products/:contractId', contractController.getContract);
router.get('/invoice/:id/:userId', contractController.getStorageIdByParty);
router.get('/getview/:contractid', contractController.getongoingContrforparty);
router.get('/get/allongoing/:id', contractController.getAllContractsByPartyId)
router.get('/invoice/storags/:partyId/:storageId', contractController.getAllContractsByPartyAndStorageforinvoice);
router.get('/invoices/all/:contractId', contractController.getAllInvoicesByContractId)
router.get('/invoices/manufacture/location/:id', contractController.getStorageIdByPartymanuf)
router.get('/in/:fileName', contractController.download)
router.get('/view/:fileName', contractController.viewPDF)
router.get("/manufacture/:contractid", contractController.getongoingContrfor);

router.get("/manufactures/closed", contractController.getAllContractsByPartyIdcompleted);
router.get("/clod/closed/:id", contractController.getcompleteContractById);


module.exports = router;