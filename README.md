Asset Management System:

1) npm install - install dependecies 
2) npx sequelize-cli db:migrate - create table for the database
3) npx sequelize-cli db:seed:all- insert value for the table in the database 
4) npm start - start the app

tables with its description:

1. Assets - Stores asset information
2. AssetCategories - stores Categories for assets
3. AssetAssignments -store asset assignments to employees
4. AssetHistory - store  history of assets
5. Employees - Employee information


View Tables structure in the appcode :

asset table - backend/asset/assetModel.js
asset- backend/assetCategory/assetCategoryModel.js
assetAssignment- backend/assetAssignment/assetAssignmentModel.js
assetHistory- backend/assetHistory/assetHistory.js
employeeModel- backend/employee/employeeModel.js