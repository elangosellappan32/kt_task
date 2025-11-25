const db = require('../models');
const { Op } = require('sequelize');

// Show issue asset form
exports.showIssueAssetForm = async (req, res) => {
  try {
    const { employee } = req.query;
    
    // Get available assets (not assigned, not retired)
    const availableAssets = await db.Asset.findAll({
      where: {
        status: 'available',
        is_active: true
      },
      include: [{
        model: db.AssetCategory,
        as: 'Category'
      }],
      order: [['name', 'ASC']]
    });

    // Get all employees
    const employees = await db.Employee.findAll({
      where: {
        status: 'active'
      },
      order: [['last_name', 'ASC'], ['first_name', 'ASC']]
    });

    res.render('assetAssignments/assetIssue', {
      availableAssets,
      employees,
      selectedEmployee: employee || null
    });
  } catch (error) {
    console.error('Error loading issue asset form:', error);
    req.flash('error_msg', 'Error loading form');
    res.redirect('/assets');
  }
};

// Issue asset to employee
exports.issueAsset = async (req, res) => {
  try {
    const { asset_id, employee_id, expected_return_date, notes } = req.body;
    
    // Check if asset is available
    const asset = await db.Asset.findByPk(asset_id);
    if (!asset || asset.status !== 'available') {
      req.flash('error_msg', 'Asset is not available for assignment');
      return res.redirect('/assets/issue');
    }

    // Check if employee exists and is active
    const employee = await db.Employee.findByPk(employee_id);
    if (!employee || employee.status !== 'active') {
      req.flash('error_msg', 'Invalid employee selection');
      return res.redirect('/assets/issue');
    }

    // Create asset assignment
    const assignment = await db.AssetAssignment.create({
      asset_id,
      employee_id,
      assigned_by: req.user ? req.user.id : 1, // Use authenticated user or default
      assigned_date: new Date(),
      expected_return_date: expected_return_date || null,
      notes: notes || null,
      status: 'assigned'
    });

    // Update asset status
    await db.Asset.update(
      { status: 'assigned' },
      { where: { id: asset_id } }
    );

    req.flash('success_msg', 'Asset issued successfully');
    res.redirect('/assets');
  } catch (error) {
    console.error('Error issuing asset:', error);
    req.flash('error_msg', 'Error issuing asset');
    res.redirect('/assets/issue');
  }
};

// Show return asset form
exports.showReturnAssetForm = async (req, res) => {
  try {
    const { asset, employee } = req.query;
    
    let assignments = [];
    let whereClause = { status: 'assigned' };

    if (asset) {
      whereClause.asset_id = asset;
    } else if (employee) {
      whereClause.employee_id = employee;
    }

    // Get active assignments
    assignments = await db.AssetAssignment.findAll({
      where: whereClause,
      include: [
        {
          model: db.Asset,
          as: 'asset',
          include: [{
            model: db.AssetCategory,
            as: 'Category'
          }]
        },
        {
          model: db.Employee,
          as: 'employee'
        }
      ],
      order: [['assigned_date', 'DESC']]
    });

    res.render('assetAssignments/assetReturn', {
      assignments,
      selectedAsset: asset || null,
      selectedEmployee: employee || null
    });
  } catch (error) {
    console.error('Error loading return asset form:', error);
    req.flash('error_msg', 'Error loading form');
    res.redirect('/assets');
  }
};

// Return asset from employee
exports.returnAsset = async (req, res) => {
  try {
    const { assignment_id, return_condition, return_notes } = req.body;
    
    // Find the assignment
    const assignment = await db.AssetAssignment.findByPk(assignment_id, {
      include: [{
        model: db.Asset,
        as: 'asset'
      }]
    });

    if (!assignment || assignment.status !== 'assigned') {
      req.flash('error_msg', 'Invalid assignment');
      return res.redirect('/assets/return');
    }

    // Update assignment
    await db.AssetAssignment.update({
      return_date: new Date(),
      return_condition,
      return_notes: return_notes || null,
      status: 'returned'
    }, {
      where: { id: assignment_id }
    });

    // Update asset status based on return condition
    let newStatus = 'available';
    if (return_condition === 'damaged') {
      newStatus = 'under_maintenance';
    } else if (return_condition === 'lost' || return_condition === 'stolen') {
      newStatus = 'retired';
    }

    await db.Asset.update(
      { status: newStatus },
      { where: { id: assignment.asset_id } }
    );

    req.flash('success_msg', 'Asset returned successfully');
    res.redirect('/assets');
  } catch (error) {
    console.error('Error returning asset:', error);
    req.flash('error_msg', 'Error returning asset');
    res.redirect('/assets/return');
  }
};

// Show scrap asset form
exports.showScrapAssetForm = async (req, res) => {
  try {
    // Get assets that can be scrapped (not already retired)
    const assets = await db.Asset.findAll({
      where: {
        status: {
          [Op.notIn]: ['retired']
        },
        is_active: true
      },
      include: [{
        model: db.AssetCategory,
        as: 'Category'
      }],
      order: [['name', 'ASC']]
    });

    res.render('assetAssignments/assetScrap', { assets });
  } catch (error) {
    console.error('Error loading scrap asset form:', error);
    req.flash('error_msg', 'Error loading form');
    res.redirect('/assets');
  }
};

// Scrap asset
exports.scrapAsset = async (req, res) => {
  try {
    const { asset_id, scrap_reason } = req.body;
    
    // Check if asset exists
    const asset = await db.Asset.findByPk(asset_id);
    if (!asset) {
      req.flash('error_msg', 'Asset not found');
      return res.redirect('/assets/assetScrap');
    }

    // Check if asset is currently assigned
    const activeAssignment = await db.AssetAssignment.findOne({
      where: {
        asset_id,
        status: 'assigned'
      }
    });

    if (activeAssignment) {
      req.flash('error_msg', 'Cannot scrap asset that is currently assigned');
      return res.redirect('/assets/scrap');
    }

    // Update asset status to retired
    await db.Asset.update({
      status: 'retired',
      notes: (asset.notes || '') + '\n\nScrapped: ' + scrap_reason
    }, {
      where: { id: asset_id }
    });

    req.flash('success_msg', 'Asset scrapped successfully');
    res.redirect('/assets');
  } catch (error) {
    console.error('Error scrapping asset:', error);
    req.flash('error_msg', 'Error scrapping asset');
    res.redirect('/assets/scrap');
  }
};
