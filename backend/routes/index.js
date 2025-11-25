const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/auth');
const db = require('../models');

// Import route modules
const assets = require('../asset/assetRoute');
const auth = require('../auth/auth');
const employees = require('../employee/employeeRoute');
const assetCategories = require('../assetCategory/assetCategoryRoute');
const stock = require('../stock/stockRoute');
const assetAssignments = require('../assetAssignment/assetAssignmentRoute');
const assetHistory = require('../assetHistory/assetHistory');

// Mount routes
router.use('/assets', assets);
router.use('/auth', auth);
router.use('/employees', employees);
router.use('/asset-categories', assetCategories);
router.use('/stock', stock);
router.use('/asset-assignments', assetAssignments);
router.use('/asset-history', assetHistory);

// Login route - directly serve login page
router.get('/login', (req, res) => res.render('auth/login'));

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Home Page - Dashboard with real data (temporarily without auth for testing)
router.get('/', async (req, res) => {
  try {
    // Get actual counts from database
    const [assetCount, employeeCount, assignedAssetCount] = await Promise.all([
      db.Asset.count({ where: { is_active: true } }),
      db.Employee.count({ where: { status: 'active' } }),
      db.AssetAssignment.count({ where: { status: 'assigned' } })
    ]);

    res.render('index', {
      assetCount,
      employeeCount,
      assignedAssetCount
    });
  } catch (error) {
    console.error('Dashboard data error:', error.message);
    // Fallback to 0 if there's an error
    res.render('index', {
      assetCount: 0,
      employeeCount: 0,
      assignedAssetCount: 0
    });
  }
});

// Dashboard (legacy route - redirect to home)
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.redirect('/');
});

module.exports = router;