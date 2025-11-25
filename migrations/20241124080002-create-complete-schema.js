'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'manager', 'user'),
        defaultValue: 'user'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create asset_categories table
    await queryInterface.createTable('asset_categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      expected_lifespan_months: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      depreciation_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create suppliers table
    await queryInterface.createTable('suppliers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact_person: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create employees table
    await queryInterface.createTable('employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hire_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      branch: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create assets table
    await queryInterface.createTable('assets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      asset_tag: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      serial_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING,
        allowNull: true
      },
      manufacturer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      purchase_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      purchase_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      current_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      warranty_months: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('available', 'assigned', 'under_maintenance', 'retired'),
        allowNull: false,
        defaultValue: 'available'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'asset_categories',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'suppliers',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      branch: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create asset_assignments table
    await queryInterface.createTable('asset_assignments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      asset_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'assets',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      assigned_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      assigned_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      expected_return_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      return_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      return_condition: {
        type: Sequelize.ENUM('excellent', 'good', 'fair', 'poor', 'damaged', 'lost', 'stolen'),
        allowNull: true
      },
      return_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('assigned', 'returned', 'lost', 'stolen', 'damaged'),
        allowNull: false,
        defaultValue: 'assigned'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create asset_maintenance table
    await queryInterface.createTable('asset_maintenance', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      asset_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'assets',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      maintenance_type: {
        type: Sequelize.ENUM('preventive', 'corrective', 'emergency'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      performed_by: {
        type: Sequelize.STRING,
        allowNull: true
      },
      performed_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      next_maintenance_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'scheduled'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('assets', ['asset_tag'], { unique: true });
    await queryInterface.addIndex('assets', ['status']);
    await queryInterface.addIndex('assets', ['category_id']);
    await queryInterface.addIndex('assets', ['supplier_id']);
    await queryInterface.addIndex('assets', ['branch']);
    await queryInterface.addIndex('employees', ['employee_id'], { unique: true });
    await queryInterface.addIndex('employees', ['email'], { unique: true });
    await queryInterface.addIndex('employees', ['department']);
    await queryInterface.addIndex('employees', ['branch']);
    await queryInterface.addIndex('asset_assignments', ['asset_id']);
    await queryInterface.addIndex('asset_assignments', ['employee_id']);
    await queryInterface.addIndex('asset_assignments', ['status']);
    await queryInterface.addIndex('asset_assignments', ['assigned_date']);
    await queryInterface.addIndex('asset_maintenance', ['asset_id']);
    await queryInterface.addIndex('asset_maintenance', ['status']);
    await queryInterface.addIndex('asset_maintenance', ['performed_date']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order due to foreign key constraints
    await queryInterface.dropTable('asset_maintenance');
    await queryInterface.dropTable('asset_assignments');
    await queryInterface.dropTable('assets');
    await queryInterface.dropTable('employees');
    await queryInterface.dropTable('suppliers');
    await queryInterface.dropTable('asset_categories');
    await queryInterface.dropTable('users');
  }
};
