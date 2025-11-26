const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const stockController = require('./stockController');

// get route for stock 
router.get('/', ensureAuthenticated, stockController.stockView);

// get route for stock data 
router.get('/data', ensureAuthenticated, stockController.stockData);

module.exports = router;
