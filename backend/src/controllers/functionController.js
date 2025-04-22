const { Function } = require('../models/Function');
const axios = require('axios');

const createFunction = async (req, res) => {
  try {
    const func = await Function.create(req.body);
    res.status(201).json(func);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFunctions = async (req, res) => {
  try {
    const functions = await Function.findAll();
    res.json(functions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFunctionById = async (req, res) => {
  try {
    const func = await Function.findByPk(req.params.id);
    if (!func) {
      return res.status(404).json({ error: 'Function not found' });
    }
    res.json(func);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFunction = async (req, res) => {
  try {
    const [updated] = await Function.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedFunc = await Function.findByPk(req.params.id);
      return res.json(updatedFunc);
    }
    throw new Error('Function not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFunction = async (req, res) => {
  try {
    const deleted = await Function.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Function deleted' });
    }
    throw new Error('Function not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to exports
const executeFunction = async (req, res) => {
    try {
      const func = await Function.findByPk(req.params.id);
      if (!func) {
        return res.status(404).json({ error: 'Function not found' });
      }
  
      const response = await axios.post('http://execution-engine:5001/execute', {
        code: func.code,
        language: func.language,
        input: req.body.input,
        timeout: func.timeout * 1000 // convert to milliseconds
      });
  
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createFunction,
  getFunctions,
  getFunctionById,
  updateFunction,
  deleteFunction,
  executeFunction
};