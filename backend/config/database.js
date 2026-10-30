const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'expense_app',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      dialect: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      logging: console.log
    }
);

module.exports = sequelize;