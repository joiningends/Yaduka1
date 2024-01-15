// routes/index.js
const express = require('express');
const router = express.Router();

const  undercontroller = require('../Controllers/underController');


// Under Route
router.post('/:id', undercontroller.createUnder);
router.get('/:id', undercontroller.getUnderById);

module.exports = router;
