const db = require('../models');
const { Op } = require('sequelize');

// List all asset for search
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
     //setup where clause
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
 // setup build clause
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

    // Get filter with order 
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

// push asset details
exports.showAsset = async (req, res) => {
  try {
    const assetId = parseInt(req.params.id, 10);
    
    // Validate asset id is a valid number
    if (isNaN(assetId)) {
      req.flash('error_msg', 'Invalid asset ID');
      return res.redirect('/assets');
    }
    
    const asset = await db.Asset.findByPk(assetId, {
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
    // Check if the request is AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({
        success: false,
        message: 'Error loading asset',
        error: process.env.NODE_ENV === 'development' ? error.message : {}
      });
    }
    // For regular requests, render the error page
    return res.status(500).render('error', { 
      message: 'Error loading asset',
      error: { 
        status: 500,
        message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while loading the asset.'
      },
      referrer: req.headers.referer || '/assets'
    });
  }
};

// push asset form and form data 
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

// save asset
exports.saveAsset = async (req, res) => {
  try {
    const { id } = req.params;
    let assetData = req.body;

    // Clean up the data
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

    // Convert string  to  numbers
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

    if (id) {
      assetData.is_active = assetData.is_active === 'on' || assetData.is_active === true || assetData.is_active === 'true';
    } else {
      assetData.is_active = assetData.is_active !== 'false' && assetData.is_active !== 'off' && assetData.is_active !== '0';
    }
  // auto genrated asset tag 
    if (!assetData.asset_tag || assetData.asset_tag.trim() === '') {
      const lastAsset = await db.Asset.findOne({
        attributes: ['asset_tag'],
        order: [['asset_tag', 'DESC']],
        limit: 1
      });
      
      let lastId = 0;
      if (lastAsset && lastAsset.asset_tag) {
        // Extract number from asset tag 
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
    
    // check unqiueness for asset tag 
    if (error.name === 'SequelizeUniqueConstraintError' && error.errors[0]?.path === 'asset_tag') {
      // Try function to generate  new asset tag and retry
      try {
        const lastAsset = await db.Asset.findOne({
          attributes: ['asset_tag'],
          order: [['asset_tag', 'DESC']],
          limit: 1
        });
        
        let lastId = 0;
        if (lastAsset && lastAsset.asset_tag) {
          // Extract number part from asset tag
          const match = lastAsset.asset_tag.match(/\d+/);
          if (match) {
            lastId = parseInt(match[0]);
          }
        }
        
        // Generate new asset tag 
        const newTag = `AST${String(lastId + 1).padStart(4, '0')}`;
        
        let retryData = { ...req.body };
        retryData.asset_tag = newTag;
        
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

        // Convert string to numbers
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

        if (id) {
          retryData.is_active = retryData.is_active === 'on' || retryData.is_active === true || retryData.is_active === 'true';
        } else {
          retryData.is_active = retryData.is_active !== 'false' && retryData.is_active !== 'off' && retryData.is_active !== '0';
        }
        
        console.log('Retrying with guaranteed unique tag:', newTag);
        console.log('Retrying with processed data:', retryData);
        
        // Retry the create asset with the processed data
        await db.Asset.create(retryData);
        req.flash('success_msg', `Asset created successfully with tag: ${newTag}`);
        return res.redirect('/assets');
      } catch (retryError) {
        console.error('Retry failed:', retryError);
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
  const transaction = await db.sequelize.transaction();
  
  try {
    // Get asset ID from URL parameters or request body
    const assetId = req.params.id || (req.body && req.body.id);
    
    if (!assetId) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Asset ID is required' 
      });
    }
    
    // Check if the asset exists
    const asset = await db.Asset.findByPk(assetId, { transaction });
    
    if (!asset) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Asset not found' 
      });
    }
    
    // Check if the asset is currently assigned
    const activeAssignment = await db.AssetAssignment.findOne({
      where: { 
        asset_id: assetId,
        status: 'assigned',
        return_date: null
      },
      transaction
    });
    
    if (activeAssignment) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete an asset that is currently assigned. Please return it first.' 
      });
    }
    
    // Soft delete the asset
    await db.Asset.update(
      { is_active: false },
      { 
        where: { id: assetId },
        transaction
      }
    );
    
    // Create a history record 
    if (db.AssetHistory) {
      try {
        await db.AssetHistory.create({
          asset_id: assetId,
          action: 'deleted',
          description: 'Asset was deleted from the system',
          changed_by: req.user ? req.user.id : null
        }, { transaction });
      } catch (historyError) {
        console.warn('Warning: Could not create asset history record:', historyError.message);
      }
    }
    
    await transaction.commit();
    
    res.json({ 
      success: true, 
      message: 'Asset deleted successfully' 
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting asset:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting asset',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};