const db = require('../models');
const { Op } = require('sequelize');

// List all asset categories
exports.listAssetCategories = async (req, res) => {
  try {
    const categories = await db.AssetCategory.findAll({
      order: [['name', 'ASC']]
    });
    res.render('assetCategories/assetCategories', { categories });
  } catch (error) {
    console.error('Error fetching asset categories:', error);
    req.flash('error_msg', 'Error loading asset categories');
    res.redirect('/');
  }
};

// Show asset category form
exports.showAssetCategoryForm = async (req, res) => {
  try {
    let category = null;
    if (req.params.id) {
      category = await db.AssetCategory.findByPk(req.params.id);
      if (!category) {
        return res.status(404).render('404');
      }
    }
    res.render('assetCategories/assetCategoriesForm', { category });
  } catch (error) {
    console.error('Error loading asset category form:', error);
    req.flash('error_msg', 'Error loading form');
    res.redirect('/asset-categories');
  }
};

// Create/Update asset category
exports.saveAssetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    if (id) {
      await db.AssetCategory.update(categoryData, { where: { id } });
      req.flash('success_msg', 'Asset category updated successfully');
    } else {
      await db.AssetCategory.create(categoryData);
      req.flash('success_msg', 'Asset category created successfully');
    }

    res.redirect('/asset-categories');
  } catch (error) {
    console.error('Error saving asset category:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      req.flash('error_msg', 'Category name already exists');
    } else {
      req.flash('error_msg', 'Error saving asset category');
    }
    res.redirect(`/asset-categories/${id ? `edit/${id}` : 'add'}`);
  }
};

// Get asset category by ID (for checking assets before deletion)
exports.getAssetCategoryById = async (req, res) => {
  try {
    const category = await db.AssetCategory.findByPk(req.params.id, {
      include: [{
        model: db.Asset,
        as: 'assets',
        attributes: ['id', 'name', 'asset_tag']
      }]
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Asset category not found' });
    }

    // Return clean JSON object
    res.json({
      id: category.id,
      name: category.name,
      description: category.description,
      expected_lifespan_months: category.expected_lifespan_months,
      depreciation_rate: category.depreciation_rate,
      is_active: category.is_active,
      assets: category.assets
    });
  } catch (error) {
    console.error('Error fetching asset category:', error);
    res.status(500).json({ success: false, message: 'Error fetching asset category' });
  }
};

// Delete asset category
exports.deleteAssetCategory = async (req, res) => {
  try {
    const category = await db.AssetCategory.findByPk(req.params.id, {
      include: [{
        model: db.Asset,
        as: 'assets'
      }]
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Asset category not found' });
    }

    if (category.assets && category.assets.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category with associated assets' });
    }

    await db.AssetCategory.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Asset category deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset category:', error);
    res.status(500).json({ success: false, message: 'Error deleting asset category' });
  }
};
