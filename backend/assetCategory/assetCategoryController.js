const db = require('../models');
const { Op } = require('sequelize');

exports.listAssetCategories = async (req, res) => {
  try {
    const categories = await db.AssetCategory.findAll({
      order: [['name', 'ASC']]
    });
    res.render('assetCategories/assetCategories', { categories });
  } catch (error) {
    console.error('Error fetching asset categories by order ASC:', error);
    req.flash('error_msg', 'Error loading asset categories');
    res.redirect('/');
  }
};

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

exports.saveAssetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    if (id) {
      await db.AssetCategory.update(categoryData, { where: { id } });
      req.flash('success_msg', 'Asset categories are updated successfully');
    } else {
      await db.AssetCategory.create(categoryData);
      req.flash('success_msg', 'Asset categories are created successfully');
    }

    res.redirect('/asset-categories');
  } catch (error) {
    console.error('Error saving asset categories:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      req.flash('error_msg', 'Category names are already exists');
    } else {
      req.flash('error_msg', 'Error saving assets category');
    }
    res.redirect(`/asset-categories/${id ? `edit/${id}` : 'add'}`);
  }
};

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
      return res.status(404).json({ success: false, message: 'Asset categories are not found' });
    }

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
    console.error('Error fetching asset categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching asset categories' });
  }
};

exports.deleteAssetCategory = async (req, res) => {
  try {
    const category = await db.AssetCategory.findByPk(req.params.id, {
      include: [{
        model: db.Asset,
        as: 'assets'
      }]
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Asset categories are not found' });
    }

    if (category.assets && category.assets.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete categories with associated assets' });
    }

    await db.AssetCategory.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Asset categories are  deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset categories:', error);
    res.status(500).json({ success: false, message: 'Error deleting asset categories' });
  }
};
