const { Sequelize } = require("sequelize");
require("dotenv").config();

// Ensure environment variables are set
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_PORT) {
  console.error("❌ Missing required database environment variables!");
  process.exit(1); // Exit process if DB variables are not set
}

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: false, // Disable logging for cleaner output
  }
);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1); // Exit process on failure
  }
})();

module.exports = sequelize;
