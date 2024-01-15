const express = require('express');
const router = express.Router();
const userController = require('../Controllers/usercontroller');

//router.get('/', userController.getUsers);
//router.get('/:id', userController.getUserById);


router.post('/:usertypeid/:admin', userController.createUser);
router.post('/:usertypeid/:admin/party', userController.create);
router.get('/:id', userController.getUsersUnderId)
router.get('/:userId/allparty/forall', userController.getparty)
router.post('/:usertypeid', userController.createColdstorageadmin);
router.get('/employee/:id', userController.getemployeeby);
router.put('/:id', userController.updateemployee);
router.delete('/:id', userController.delectemployee)
router.get('/party/:mobileNumber', userController.searchByMobileNumber)

module.exports = router;