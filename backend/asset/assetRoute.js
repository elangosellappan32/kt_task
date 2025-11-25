const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const assetsController = require('./assetController');

// Get all assets
router.get('/', ensureAuthenticated, assetsController.listAssets);

// Show add asset form
router.get('/add', ensureAuthenticated, assetsController.showAssetForm);

// Add new asset
router.post('/', ensureAuthenticated, assetsController.saveAsset);

// Show asset details
router.get('/:id', ensureAuthenticated, assetsController.showAsset);

// Show edit asset form
router.get('/edit/:id', ensureAuthenticated, assetsController.showAssetForm);

// Update asset
router.put('/:id', ensureAuthenticated, assetsController.saveAsset);

// Delete asset
router.delete('/:id', ensureAuthenticated, assetsController.deleteAsset);

module.exports = router;
