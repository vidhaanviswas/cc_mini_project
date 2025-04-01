const { DataTypes } = require('sequelize');
const sequelize = require('../../db/config');

const Function = sequelize.define('Function', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  route: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeout: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',  // This maps to the `created_at` column in the DB
  },
}, {
  tableName: 'functions',
  timestamps: false,  // Disable automatic `createdAt` and `updatedAt`
});

module.exports = Function;
