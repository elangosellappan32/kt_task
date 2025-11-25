module.exports = (sequelize, DataTypes) => {
  const AssetCategory = sequelize.define('AssetCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expected_lifespan_months: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Expected lifespan in months'
    },
    depreciation_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Annual depreciation rate in percentage'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'asset_categories',
    timestamps: true,
    underscored: true
  });

  AssetCategory.associate = (models) => {
    AssetCategory.hasMany(models.Asset, {
      foreignKey: 'category_id',
      as: 'assets'
    });
  };

  return AssetCategory;
};
