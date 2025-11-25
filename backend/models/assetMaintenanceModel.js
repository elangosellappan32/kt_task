module.exports = (sequelize, DataTypes) => {
  const AssetMaintenance = sequelize.define('AssetMaintenance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assets',
        key: 'id'
      }
    },
    maintenance_type: {
      type: DataTypes.ENUM(
        'repair',
        'preventive',
        'upgrade',
        'inspection',
        'calibration',
        'other'
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'suppliers',
        key: 'id'
      }
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'scheduled',
        'in_progress',
        'completed',
        'cancelled',
        'on_hold'
      ),
      defaultValue: 'scheduled'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'asset_maintenances',
    timestamps: true,
    underscored: true
  });

  AssetMaintenance.associate = (models) => {
    AssetMaintenance.belongsTo(models.Asset, {
      foreignKey: 'asset_id',
      as: 'asset'
    });
    
    AssetMaintenance.belongsTo(models.Supplier, {
      foreignKey: 'supplier_id',
      as: 'supplier'
    });
    
    AssetMaintenance.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'assignedTo'
    });
  };

  return AssetMaintenance;
};
