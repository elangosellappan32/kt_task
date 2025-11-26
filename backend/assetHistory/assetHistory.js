const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const assetHistoryController = require('./assetHistoryController');

// get route method for fetch all history 
router.get('/', ensureAuthenticated, assetHistoryController.listAssetsForHistory);

// get route method for specific asset data 
router.get('/:id', ensureAuthenticated, assetHistoryController.showAssetHistory);

module.exports = router;
