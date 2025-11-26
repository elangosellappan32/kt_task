const { Sequelize } = require('sequelize');
require('dotenv').config();

//setup sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'kt_task',
  process.env.DB_USER || 'postgres', 
  process.env.DB_PASSWORD || 'prasanna',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    
    //models used for fetching and storing data
    const models = require('../models');
    
    Object.keys(models).forEach(modelName => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });
    
    // Sync models 
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
    }
    
    return {
      sequelize,
      ...models
    };
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDB
};
