const express = require('express');
const bodyParser = require('body-parser');
const DockerExecutor = require('./executor');

const app = express();
app.use(bodyParser.json());

const executor = new DockerExecutor();

app.post('/execute', async (req, res) => {
  try {
    const { code, language, input, timeout } = req.body;
    const result = await executor.executeFunction(code, language, input, timeout);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Execution engine running on port ${PORT}`);
});