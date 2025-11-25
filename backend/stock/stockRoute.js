const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const stockController = require('./stockController');

// Stock view page
router.get('/', ensureAuthenticated, stockController.stockView);

// API endpoint for stock data
router.get('/data', ensureAuthenticated, stockController.stockData);

module.exports = router;
