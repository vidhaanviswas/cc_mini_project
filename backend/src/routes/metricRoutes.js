const express = require('express');
const router = express.Router();
const { recordMetric, getFunctionMetrics } = require('../controllers/metricController');

router.post('/', recordMetric);
router.get('/function/:id', getFunctionMetrics);

module.exports = router;