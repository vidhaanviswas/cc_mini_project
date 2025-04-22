const { Metric } = require('../models/Metric');
const { Function } = require('../models/Function');

const recordMetric = async (req, res) => {
  try {
    const metric = await Metric.create(req.body);
    res.status(201).json(metric);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFunctionMetrics = async (req, res) => {
  try {
    const metrics = await Metric.findAll({
      where: { functionId: req.params.id },
      include: [Function],
      order: [['timestamp', 'DESC']]
    });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  recordMetric,
  getFunctionMetrics
};