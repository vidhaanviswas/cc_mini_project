const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Function = sequelize.define('Function', {
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
  route: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timeout: {
    type: DataTypes.INTEGER,
    defaultValue: 10 // seconds
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
});

module.exports = Function;