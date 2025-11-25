const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const assetHistoryController = require('./assetHistoryController');

// List assets for history selection
router.get('/', ensureAuthenticated, assetHistoryController.listAssetsForHistory);

// Show specific asset history
router.get('/:id', ensureAuthenticated, assetHistoryController.showAssetHistory);

module.exports = router;
