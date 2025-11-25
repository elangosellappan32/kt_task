const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const assetAssignmentController = require('./assetAssignmentController');

// Asset assignments home - redirect to issue form
router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/asset-assignments/issue');
});

// Issue Asset
router.get('/issue', ensureAuthenticated, assetAssignmentController.showIssueAssetForm);
router.post('/issue', ensureAuthenticated, assetAssignmentController.issueAsset);

// Return Asset
router.get('/return', ensureAuthenticated, assetAssignmentController.showReturnAssetForm);
router.post('/return', ensureAuthenticated, assetAssignmentController.returnAsset);

// Scrap Asset
router.get('/scrap', ensureAuthenticated, assetAssignmentController.showScrapAssetForm);
router.post('/scrap', ensureAuthenticated, assetAssignmentController.scrapAsset);

module.exports = router;
