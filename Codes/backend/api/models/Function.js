const { DataTypes } = require("sequelize");
const sequelize = require("../../db/config");

const Function = sequelize.define("Function", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  route: { type: DataTypes.STRING, unique: true, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  timeout: { type: DataTypes.INTEGER, defaultValue: 5 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Function;
