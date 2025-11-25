const db = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

/**
 * List all employees with pagination and search
 * GET /employees
 */
exports.listEmployees = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = '', 
      department = '',
      branch = '',
      sortBy = 'last_name',
      sortOrder = 'ASC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { employee_id: { [Op.like]: `%${search}%` } },
        { position: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (department) {
      whereClause.department = department;
    }
    
    if (branch) {
      whereClause.branch = branch;
    }

    const { count, rows: employees } = await db.Employee.findAndCountAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    // Get filter options
    const [departments, branches, statuses] = await Promise.all([
      db.Employee.findAll({ 
        attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('department')), 'department']],
        order: [['department', 'ASC']]
      }),
      db.Employee.findAll({ 
        attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('branch')), 'branch']],
        order: [['branch', 'ASC']]
      }),
      // Static statuses from model
      ['active', 'inactive']
    ]);

    const totalPages = Math.ceil(count / limit);

    res.render('employees/employees', { 
      employees,
      departments: departments.map(d => d.department).filter(Boolean),
      branches: branches.map(b => b.branch).filter(Boolean),
      statuses,
      currentPage: parseInt(page),
      totalPages,
      searchQuery: search,
      selectedStatus: status,
      selectedDepartment: department,
      selectedBranch: branch,
      sortBy,
      sortOrder,
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    req.flash('error_msg', 'Failed to load employees. Please try again.');
    res.redirect('/');
  }
};

/**
 * Show employee details with assigned assets
 * GET /employees/:id
 */
exports.showEmployee = async (req, res) => {
  try {
    console.log('Fetching employee with ID:', req.params.id);
    
    const employee = await db.Employee.findByPk(req.params.id, {
      include: [{
        model: db.AssetAssignment,
        as: 'assignments',
        include: [{
          model: db.Asset,
          as: 'asset',
          include: [{
            model: db.AssetCategory,
            as: 'Category'
          }]
        }],
        where: { status: 'assigned' },
        required: false
      }],
      order: [[{ model: db.AssetAssignment, as: 'assignments' }, 'assigned_date', 'DESC']]
    });

    console.log('Employee found:', employee ? 'Yes' : 'No');
    if (employee) {
      console.log('Employee name:', employee.first_name, employee.last_name);
      console.log('Assignments count:', employee.assignments ? employee.assignments.length : 0);
    }

    if (!employee) {
      console.log('Employee not found, redirecting...');
      req.flash('error', 'Employee not found');
      return res.redirect('/employees');
    }
    
    console.log('Rendering employee show page...');
    res.render('employees/employeeDetails', { 
      employee,
      assignments: employee.assignments || [],
      currentUrl: req.originalUrl
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    console.error('Error stack:', error.stack);
    req.flash('error', 'Failed to load employee details');
    res.redirect('/employees');
  }
};

// Show employee form
exports.showEmployeeForm = async (req, res) => {
  try {
    let employee = {};
    const isEdit = !!req.params.id;
    
    if (isEdit) {
      employee = await db.Employee.findByPk(req.params.id);
      if (!employee) {
        req.flash('error_msg', 'Employee not found');
        return res.redirect('/employees');
      }
    }
    
    // Get departments and branches for the form
    const departments = [];
    const branches = [];
    
    res.render('employees/employeeForm', { 
      employee, 
      isEdit,
      departments,
      branches
    });
  } catch (error) {
    console.error('Error loading employee form:', error);
    req.flash('error_msg', 'Error loading employee form');
    res.redirect('/employees');
  }
};

// Create/Update employee
exports.saveEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeData = req.body;
    
    console.log('Saving employee data:', employeeData);
    console.log('Request params:', req.params);

    if (id) {
      await db.Employee.update(employeeData, { where: { id } });
      req.flash('success_msg', 'Employee updated successfully');
    } else {
      // Generate employee ID if new employee
      if (!employeeData.employee_id) {
        // Find the highest numeric employee ID
        const employees = await db.Employee.findAll({
          attributes: ['employee_id'],
          order: [['employee_id', 'DESC']],
          limit: 1
        });
        
        let lastId = 0;
        if (employees.length > 0 && employees[0].employee_id) {
          const idNum = parseInt(employees[0].employee_id.replace('EMP', ''));
          lastId = isNaN(idNum) ? 0 : idNum;
        }
        
        employeeData.employee_id = `EMP${String(lastId + 1).padStart(4, '0')}`;
        console.log('Generated employee ID:', employeeData.employee_id);
        console.log('Last employee ID found:', employees.length > 0 ? employees[0].employee_id : 'None');
      }
      
      console.log('Creating employee with data:', employeeData);
      await db.Employee.create(employeeData);
      req.flash('success_msg', 'Employee created successfully');
    }

    res.redirect('/employees');
  } catch (error) {
    console.error('Error saving employee:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).render('employees/employeeForm', {
      employee: req.body,
      isEdit: !!req.params.id,
      departments: [],
      branches: [],
      error: `Error saving employee: ${error.message}`
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    await db.Employee.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, message: 'Error deleting employee' });
  }
};