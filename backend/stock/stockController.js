const db = require('../models');
const { Op } = require('sequelize');

// display Stock in birds eye 
exports.stockView = async (req, res) => {
  try {
    //fetch all available asset 
    const availableAssets = await db.Asset.findAll({
      where: {
        status: 'available',
        is_active: true
      },
      include: [{
        model: db.AssetCategory,
        as: 'Category'
      }],
      order: [['branch', 'ASC'], ['name', 'ASC']]
    });

    //set asset fetch  by branch 
    const assetsByBranch = {};
    let totalValue = 0;

    availableAssets.forEach(asset => {
      const branch = asset.branch || 'Unassigned';
      if (!assetsByBranch[branch]) {
        assetsByBranch[branch] = {
          assets: [],
          count: 0,
          totalValue: 0
        };
      }
      
      assetsByBranch[branch].assets.push(asset);
      assetsByBranch[branch].count++;
      
      const assetValue = parseFloat(asset.current_value || asset.purchase_cost || 0);
      assetsByBranch[branch].totalValue += assetValue;
      totalValue += assetValue;
    });

    // display category summary

    const categorySummary = {};
    availableAssets.forEach(asset => {
      const categoryName = asset.Category ? asset.Category.name : 'Uncategorized';
      if (!categorySummary[categoryName]) {
        categorySummary[categoryName] = 0;
      }
      categorySummary[categoryName]++;
    });

    res.render('stock/stock', {
      assetsByBranch,
      categorySummary,
      totalValue,
      totalAssets: availableAssets.length
    });
  } catch (error) {
    console.error('Error loading stock view:', error);
    req.flash('error_msg', 'Error loading stock view');
    res.redirect('/');
  }
};

//ajax call for stock data 
exports.stockData = async (req, res) => {
  try {
    const { branch } = req.query;
    
    let whereClause = {
      status: 'available',
      is_active: true
    };
    
    if (branch && branch !== 'all') {
      whereClause.branch = branch;
    }

    const assets = await db.Asset.findAll({
      where: whereClause,
      include: [{
        model: db.AssetCategory,
        as: 'Category'
      }],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      assets: assets.map(asset => ({
        id: asset.id,
        asset_tag: asset.asset_tag,
        name: asset.name,
        category: asset.Category ? asset.Category.name : 'Uncategorized',
        serial_number: asset.serial_number,
        purchase_cost: asset.purchase_cost,
        current_value: asset.current_value,
        branch: asset.branch || 'Unassigned'
      }))
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ success: false, error: 'Error fetching stock data' });
  }
};
