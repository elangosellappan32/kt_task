module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    asset_tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    purchase_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    current_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    warranty_months: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available', 'assigned', 'under_maintenance', 'retired'),
      allowNull: false,
      defaultValue: 'available'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'asset_categories',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'suppliers',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'assets',
    timestamps: true,
    underscored: true
  });

  Asset.associate = function(models) {
    // Define association for the other models
    Asset.belongsTo(models.AssetCategory, { foreignKey: 'category_id', as: 'Category' });
    Asset.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
    Asset.hasMany(models.AssetAssignment, { foreignKey: 'asset_id', as: 'Assignments' });
    Asset.hasMany(models.AssetMaintenance, { foreignKey: 'asset_id' });
  };

  return Asset;
};