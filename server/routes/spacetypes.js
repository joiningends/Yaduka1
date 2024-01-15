const express = require('express');
const router = express.Router();
const spaceTypeController = require('../Controllers/spacetypeController');

// Routes
router.post('/create', spaceTypeController.createSpaceType);
router.get('/', spaceTypeController.getAllSpaceTypes);
router.get('/:id', spaceTypeController.getSpaceTypeById);
router.put('/:id', spaceTypeController.updateSpaceType);
router.delete('/:id', spaceTypeController.deleteSpaceType);

module.exports = router;
