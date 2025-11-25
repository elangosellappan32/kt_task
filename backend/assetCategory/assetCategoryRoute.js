const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const assetCategoryController = require('./assetCategoryController');

// Get all asset categories
router.get('/', ensureAuthenticated, assetCategoryController.listAssetCategories);

// Show add asset category form
router.get('/add', ensureAuthenticated, assetCategoryController.showAssetCategoryForm);

// Add new asset category
router.post('/', ensureAuthenticated, assetCategoryController.saveAssetCategory);

// Show edit asset category form
router.get('/edit/:id', ensureAuthenticated, assetCategoryController.showAssetCategoryForm);

// Update asset category
router.put('/:id', ensureAuthenticated, assetCategoryController.saveAssetCategory);

// Get asset category by ID (for checking assets before deletion)
router.get('/:id', ensureAuthenticated, assetCategoryController.getAssetCategoryById);

// Delete asset category
router.delete('/:id', ensureAuthenticated, assetCategoryController.deleteAssetCategory);

module.exports = router;
