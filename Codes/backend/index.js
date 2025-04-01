const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./db/config");
const functionRoutes = require("./api/routes/functionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Serverless API Running" });
});

// Function Routes
app.use("/functions", functionRoutes);

const PORT = process.env.PORT || 8000;

// Initialize Database and Start Server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync(); // Ensures tables exist
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  }
}

startServer();
