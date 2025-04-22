const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Metric = sequelize.define('Metric', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  functionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  executionTime: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  memoryUsage: {
    type: DataTypes.FLOAT
  },
  success: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  technology: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Metric;