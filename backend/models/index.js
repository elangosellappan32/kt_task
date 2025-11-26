const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const { sequelize } = require('../config/database');

// Read  directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&   //skiped hidden files 
      file !== basename &&
      file.slice(-3) === '.js' &&   //only .js file
      file.indexOf('.test.js') === -1 //skipped test files
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// load  other model  directories
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

//setup associate
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//sequelize all model
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
