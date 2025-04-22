const express = require('express');
const router = express.Router();
const {
  createFunction,
  getFunctions,
  getFunctionById,
  updateFunction,
  deleteFunction,
  executeFunction
} = require('../controllers/functionController');

router.post('/', createFunction);
router.get('/', getFunctions);
router.get('/:id', getFunctionById);
router.put('/:id', updateFunction);
router.delete('/:id', deleteFunction);
router.post('/:id/execute', executeFunction);

module.exports = router;