const db = require('../models');
const { Op } = require('sequelize');

// List all assets with pagination and search
exports.listAssets = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      category = '', 
      status = '', 
      branch = '',
      sortBy = 'name',
      sortOrder = 'ASC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = { is_active: true };
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { asset_tag: { [Op.like]: `%${search}%` } },
        { serial_number: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { manufacturer: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category) {
      whereClause.category_id = category;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (branch) {
      whereClause.branch = branch;
    }

    // Build include clause
    const includeClause = [{
      model: db.AssetCategory,
      as: 'Category',
      attributes: ['id', 'name']
    }, {
      model: db.AssetAssignment,
      as: 'Assignments',
      include: [{
        model: db.Employee,
        as: 'employee',
        attributes: ['id', 'first_name', 'last_name', 'employee_id']
      }],
      where: { 
        status: 'assigned',
        return_date: null 
      },
      required: false,
      limit: 1
    }];

    const { count, rows: assets } = await db.Asset.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    // Get filter options
    const [categories, branches, statuses] = await Promise.all([
      db.AssetCategory.findAll({ 
        where: { is_active: true },
        order: [['name', 'ASC']] 
      }),
      db.Asset.findAll({ 
        where: { is_active: true },
        attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('branch')), 'branch']],
        order: [['branch', 'ASC']]
      }),
      // Static statuses from model
      ['available', 'assigned', 'under_maintenance', 'retired']
    ]);

    const totalPages = Math.ceil(count / limit);

    res.render('assets/asset', { 
      assets,
      categories,
      branches: branches.map(b => b.branch).filter(Boolean),
      statuses,
      currentPage: parseInt(page),
      totalPages,
      totalCount: count,
      searchQuery: search,
      selectedCategory: category,
      selectedStatus: status,
      selectedBranch: branch,
      sortBy,
      sortOrder,
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    req.flash('error_msg', 'Failed to load assets. Please try again.');
    res.redirect('/');
  }
};

// Show asset details
exports.showAsset = async (req, res) => {
  try {
    const asset = await db.Asset.findByPk(req.params.id, {
      include: [
        { 
          model: db.AssetCategory,
          as: 'Category'
        },
        {
          model: db.AssetAssignment,
          as: 'Assignments',
          include: [{
            model: db.Employee,
            as: 'employee'
          }],
          order: [['assigned_date', 'DESC']]
        }
      ]
    });

    if (!asset) {
      return res.status(404).render('404', { referrer: req.headers.referer });
    }

    res.render('assets/assetDetails', { asset });
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).render('error', { 
      message: 'Error loading asset',
      error: { status: 500 },
      referrer: req.headers.referer
    });
  }
};

// Show asset form
exports.showAssetForm = async (req, res) => {
  try {
    let asset = null;
    if (req.params.id) {
      asset = await db.Asset.findByPk(req.params.id, {
        include: [{
          model: db.AssetCategory,
          as: 'Category'
        }]
      });
      if (!asset) {
        return res.status(404).render('404', { referrer: req.headers.referer });
      }
    }
    
    // Get all categories for the dropdown
    const categories = await db.AssetCategory.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });
    
    res.render('assets/assetForm', { asset, categories });
  } catch (error) {
    console.error('Error loading asset form:', error);
    req.flash('error_msg', 'Error loading form');
    res.redirect('/assets');
  }
};

// Create/Update asset
exports.saveAsset = async (req, res) => {
  try {
    const { id } = req.params;
    let assetData = req.body;

    // Clean up the data - handle empty strings for integer fields
    if (assetData.category_id === '') {
      delete assetData.category_id;
    }
    if (assetData.warranty_months === '') {
      delete assetData.warranty_months;
    }
    if (assetData.purchase_cost === '') {
      delete assetData.purchase_cost;
    }
    if (assetData.current_value === '') {
      delete assetData.current_value;
    }

    // Convert string numbers to actual numbers
    if (assetData.warranty_months) {
      assetData.warranty_months = parseInt(assetData.warranty_months);
    }
    if (assetData.purchase_cost) {
      assetData.purchase_cost = parseFloat(assetData.purchase_cost);
    }
    if (assetData.current_value) {
      assetData.current_value = parseFloat(assetData.current_value);
    }
    if (assetData.category_id) {
      assetData.category_id = parseInt(assetData.category_id);
    }

    // Handle boolean field - default to true for new assets if not specified
    if (id) {
      // For existing assets, use the checkbox value
      assetData.is_active = assetData.is_active === 'on' || assetData.is_active === true || assetData.is_active === 'true';
    } else {
      // For new assets, default to true unless explicitly set to false
      assetData.is_active = assetData.is_active !== 'false' && assetData.is_active !== 'off' && assetData.is_active !== '0';
    }

    // Generate asset tag if not provided
    if (!assetData.asset_tag || assetData.asset_tag.trim() === '') {
      const lastAsset = await db.Asset.findOne({
        attributes: ['asset_tag'],
        order: [['asset_tag', 'DESC']],
        limit: 1
      });
      
      let lastId = 0;
      if (lastAsset && lastAsset.asset_tag) {
        // Extract numeric part from asset tag (e.g., AST1005 -> 1005)
        const match = lastAsset.asset_tag.match(/\d+/);
        if (match) {
          lastId = parseInt(match[0]);
        }
      }
      
      assetData.asset_tag = `AST${String(lastId + 1).padStart(4, '0')}`;
      console.log('Generated asset tag:', assetData.asset_tag);
    }

    console.log('Processed asset data:', assetData);

    if (id) {
      await db.Asset.update(assetData, { where: { id } });
      req.flash('success_msg', 'Asset updated successfully');
    } else {
      await db.Asset.create(assetData);
      req.flash('success_msg', 'Asset created successfully');
    }

    res.redirect('/assets');
  } catch (error) {
    console.error('Error saving asset:', error);
    console.error('Error details:', error.message);
    
    // Handle unique constraint violation for asset_tag
    if (error.name === 'SequelizeUniqueConstraintError' && error.errors[0]?.path === 'asset_tag') {
      // Try to generate a new asset tag and retry
      try {
        // Get the highest existing asset tag
        const lastAsset = await db.Asset.findOne({
          attributes: ['asset_tag'],
          order: [['asset_tag', 'DESC']],
          limit: 1
        });
        
        let lastId = 0;
        if (lastAsset && lastAsset.asset_tag) {
          // Extract numeric part from asset tag (e.g., AST1009 -> 1009)
          const match = lastAsset.asset_tag.match(/\d+/);
          if (match) {
            lastId = parseInt(match[0]);
          }
        }
        
        // Generate a new tag that's guaranteed to be unique
        const newTag = `AST${String(lastId + 1).padStart(4, '0')}`;
        
        // Create a new processed asset data object for retry
        let retryData = { ...req.body };
        retryData.asset_tag = newTag;
        
        // Process the retry data the same way as original data
        if (retryData.category_id === '') {
          delete retryData.category_id;
        }
        if (retryData.warranty_months === '') {
          delete retryData.warranty_months;
        }
        if (retryData.purchase_cost === '') {
          delete retryData.purchase_cost;
        }
        if (retryData.current_value === '') {
          delete retryData.current_value;
        }

        // Convert string numbers to actual numbers
        if (retryData.warranty_months) {
          retryData.warranty_months = parseInt(retryData.warranty_months);
        }
        if (retryData.purchase_cost) {
          retryData.purchase_cost = parseFloat(retryData.purchase_cost);
        }
        if (retryData.current_value) {
          retryData.current_value = parseFloat(retryData.current_value);
        }
        if (retryData.category_id) {
          retryData.category_id = parseInt(retryData.category_id);
        }

        // Handle boolean field - use same logic as main flow
        if (id) {
          // For existing assets, use the checkbox value
          retryData.is_active = retryData.is_active === 'on' || retryData.is_active === true || retryData.is_active === 'true';
        } else {
          // For new assets, default to true unless explicitly set to false
          retryData.is_active = retryData.is_active !== 'false' && retryData.is_active !== 'off' && retryData.is_active !== '0';
        }
        
        console.log('Retrying with guaranteed unique tag:', newTag);
        console.log('Retrying with processed data:', retryData);
        
        // Retry the creation with the processed data
        await db.Asset.create(retryData);
        req.flash('success_msg', `Asset created successfully with tag: ${newTag}`);
        return res.redirect('/assets');
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        // If retry also fails, show the original error
        const categories = await db.AssetCategory.findAll();
        res.status(500).render('assets/assetForm', {
          asset: req.body,
          categories,
          error: `Error saving asset: Could not generate unique tag. Please try again or leave tag empty.`
        });
        return;
      }
    }
    
    const categories = await db.AssetCategory.findAll();
    res.status(500).render('assets/assetForm', {
      asset: req.body,
      categories,
      error: `Error saving asset: ${error.message}`
    });
  }
};

// Delete asset
exports.deleteAsset = async (req, res) => {
  try {
    await db.Asset.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ success: false, message: 'Error deleting asset' });
  }
};