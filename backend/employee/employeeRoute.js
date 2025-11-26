const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const employeeController = require('./employeeController');

// get  all employees
router.get('/', ensureAuthenticated, employeeController.listEmployees);

// add employee
router.get('/add', ensureAuthenticated, employeeController.showEmployeeForm);

// get data from selected  employee 
router.get('/:id/edit', ensureAuthenticated, employeeController.showEmployeeForm);

// get and display employee detail
router.get('/:id', ensureAuthenticated, employeeController.showEmployee);

// create  employee 
router.post('/', ensureAuthenticated, employeeController.saveEmployee);

// update employee 
router.put('/:id', ensureAuthenticated, employeeController.saveEmployee);

// Delete employee 
router.delete('/:id', ensureAuthenticated, employeeController.deleteEmployee);

module.exports = router;
