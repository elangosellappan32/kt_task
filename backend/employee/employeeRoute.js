const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const employeeController = require('./employeeController');

// Get all employees
router.get('/', ensureAuthenticated, employeeController.listEmployees);

// Show add employee form
router.get('/add', ensureAuthenticated, employeeController.showEmployeeForm);

// Show edit employee form - must come before :id route
router.get('/:id/edit', ensureAuthenticated, employeeController.showEmployeeForm);

// Show employee details
router.get('/:id', ensureAuthenticated, employeeController.showEmployee);

// Add new employee
router.post('/', ensureAuthenticated, employeeController.saveEmployee);

// Update employee
router.put('/:id', ensureAuthenticated, employeeController.saveEmployee);

// Delete employee
router.delete('/:id', ensureAuthenticated, employeeController.deleteEmployee);

module.exports = router;
