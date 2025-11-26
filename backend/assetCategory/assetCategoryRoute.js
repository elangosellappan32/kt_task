const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const assetCategoryController = require('./assetCategoryController');

// get route for asset categories
router.get('/', ensureAuthenticated, assetCategoryController.listAssetCategories);

// get route for  display add asset category form
router.get('/add', ensureAuthenticated, assetCategoryController.showAssetCategoryForm);

// post route for create asset category
router.post('/', ensureAuthenticated, assetCategoryController.saveAssetCategory);

// get route asset category for edit 
router.get('/edit/:id', ensureAuthenticated, assetCategoryController.showAssetCategoryForm);

// put route for method  asset category
router.put('/:id', ensureAuthenticated, assetCategoryController.saveAssetCategory);

// get asset category for delete category
router.get('/:id', ensureAuthenticated, assetCategoryController.getAssetCategoryById);

// Delete asset category
router.delete('/:id', ensureAuthenticated, assetCategoryController.deleteAssetCategory);

module.exports = router;
