const db = require('../models');
const { Op } = require('sequelize');

exports.showAssetHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // get asset with id
    const asset = await db.Asset.findByPk(id, {
      include: [{
        model: db.AssetCategory,
        as: 'Category'
      }]
    });
    if (!asset) {
      req.flash('error_msg', 'Asset not found');
      return res.redirect('/assets');
    }

    const assignments = await db.AssetAssignment.findAll({
      where: { asset_id: id },
      include: [
        {
          model: db.Employee,
          as: 'employee'
        },
        {
          model: db.Employee,
          as: 'assignedBy'
        }
      ],
      order: [['assigned_date', 'DESC']]
    });

    // Create timeline for chronological order 
    const timeline = [];
    
    //start purchase if the date exist with data
    if (asset.purchase_date) {
      timeline.push({
        date: asset.purchase_date,
        type: 'purchase',
        title: 'Asset Purchased',
        description: `Purchased for $${asset.purchase_cost || 'N/A'}`,
        icon: 'fas-shopping-cart',
        color: 'success'
      });
    }
  // create assignment 
    assignments.forEach(assignment => {
      timeline.push({
        date: assignment.assigned_date,
        type: 'assigned',
        title: 'Asset Issued',
        description: `Issued to ${assignment.employee ? assignment.employee.first_name + ' ' + assignment.employee.last_name : 'Unknown'}`,
        details: assignment.notes || null,
        icon: 'fas-hand-holding-box',
        color: 'primary'
      });

      if (assignment.return_date) {
        timeline.push({
          date: assignment.return_date,
          type: 'returned',
          title: 'Asset Returned',
          description: `Returned by ${assignment.employee ? assignment.employee.first_name + ' ' + assignment.employee.last_name : 'Unknown'}`,
          details: `Condition: ${assignment.return_condition}${assignment.return_notes ? ' - ' + assignment.return_notes : ''}`,
          icon: 'fas-undo',
          color: assignment.return_condition === 'damaged' ? 'warning' : 'success'
        });
      }
    });

    // Sort timeline by date
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalDays = asset.purchase_date ? 
      Math.ceil((new Date() - new Date(asset.purchase_date)) / (1000 * 60 * 60 * 24)) : 0;
    
    let assignedDays = 0;
    assignments.forEach(assignment => {
      try {
        const startDate = new Date(assignment.assigned_date);
        const endDate = assignment.return_date ? new Date(assignment.return_date) : new Date();
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          assignedDays += Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        }
      } catch (dateError) {
        console.warn('Invalid date in assignment:', assignment.id);
      }
    });

    const utilizationRate = totalDays > 0 ? Math.min(100, Math.max(0, (assignedDays / totalDays) * 100)).toFixed(1) : '0.0';

    res.render('assetHistory/assetHistory', {
      asset,
      assignments,
      timeline,
      metrics: {
        totalDays,
        assignedDays,
        utilizationRate,
        totalAssignments: assignments.length,
        currentAssignment: assignments.find(a => a.status === 'assigned')
      }
    });
  } catch (error) {
    console.error('Asset history error:', error.message);
    req.flash('error_msg', 'Unable to load asset history. Please try again.');
    res.redirect('/assets');
  }
};

// Get all assets with their category and display them in ascending order
exports.listAssetsForHistory = async (req, res) => {
  try {
    const assets = await db.Asset.findAll({
      include: [{
        model: db.AssetCategory,
        as: 'Category'
      }],
      order: [['name', 'ASC']]
    });

    res.render('assetHistory/assetHistorySummary', { assets });
  } catch (error) {
    console.error('Assets list error:', error.message);
    req.flash('error_msg', 'Unable to load assets list Please try again later.');
    res.redirect('/assets');
  }
};
