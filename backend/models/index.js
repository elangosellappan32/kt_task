const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const { sequelize } = require('../config/database');

// Read all model files from models directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Also load models from other directories
const additionalModelPaths = [
  ['..', 'asset', 'assetModel.js'],
  ['..', 'assetAssignment', 'assetAssignmentModel.js'],
  ['..', 'assetCategory', 'assetCategoryModel.js'],
  ['..', 'employee', 'employeeModel.js']
];

additionalModelPaths.forEach(modelPathArray => {
  const modelPath = path.join(__dirname, ...modelPathArray);
  if (fs.existsSync(modelPath)) {
    const model = require(modelPath)(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
});

// Associate models if associations are defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
