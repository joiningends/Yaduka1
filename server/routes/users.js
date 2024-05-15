const express = require("express");
const router = express.Router();
const userController = require("../Controllers/usercontroller");

//router.get('/', userController.getUsers);

router.post("/:usertypeid/:admin", userController.createUser);
router.post("/:usertypeid/:admin/party", userController.create);
router.get("/:id", userController.getUsersUnderId);
router.get("/:userId/allparty/forall", userController.getparty);
router.post("/:usertypeid", userController.createColdstorageadmin);
router.get("/employee/:id", userController.getemployeeby);
router.put("/:id/update", userController.updateemployee);
router.delete("/:id", userController.deleteEmployee);
router.get("/party/:mobileNumber", userController.searchByMobileNumber);
router.get("/", userController.getUsersByUserType);
router.get("/all/:id", userController.getPartiesByUserIds);
router.get("/all/party/all", userController.getAllPartiesAndUsers);
router.post("/login/for/all", userController.loginUser);

router.post("/login/for/all/send", userController.sendotp);
router.post("/login/for/all/verify", userController.verifyOtp);

router.put("/:id/password", userController.setPassword);
router.get("/:mobileNumber/getf/by/id/user", userController.getUserById);

router.get("/getbyid/:id", userController.userById);
router.get("/getparty/:id", userController.getUsersparty);

router.get("/invoice/:id", userController.getUsersWithType4);
router.get("/edit/:id", userController.getUserByIda);

router.get("/get/:id", userController.getUsersUnderIdmanufacture);
router.get("/adminall/coldstorage", userController.allCloudStorageAdmin);

module.exports = router;
