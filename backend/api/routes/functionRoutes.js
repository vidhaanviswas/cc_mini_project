const express = require("express");
const FunctionModel = require("../models/functionModel");

const router = express.Router();

// Create Function
router.post("/", async (req, res) => {
  try {
    const { name, route, language, timeout } = req.body;
    const newFunction = await FunctionModel.create({ name, route, language, timeout });
    res.status(201).json(newFunction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Functions
router.get("/", async (req, res) => {
  const functions = await FunctionModel.findAll();
  res.json(functions);
});

// Get Function by ID
router.get("/:id", async (req, res) => {
  const func = await FunctionModel.findByPk(req.params.id);
  func ? res.json(func) : res.status(404).json({ error: "Function not found" });
});

// Update Function
router.put("/:id", async (req, res) => {
  const { name, route, language, timeout } = req.body;
  const updated = await FunctionModel.update({ name, route, language, timeout }, { where: { id: req.params.id } });
  updated[0] ? res.json({ message: "Updated successfully" }) : res.status(404).json({ error: "Function not found" });
});

// Delete Function
router.delete("/:id", async (req, res) => {
  const deleted = await FunctionModel.destroy({ where: { id: req.params.id } });
  deleted ? res.json({ message: "Deleted successfully" }) : res.status(404).json({ error: "Function not found" });
});

module.exports = router;
