import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [functions, setFunctions] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        const response = await api.get('/functions');
        setFunctions(response.data);
        if (response.data.length > 0) {
          setSelectedFunction(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching functions:', error);
      }
    };
    fetchFunctions();
  }, []);

  useEffect(() => {
    if (selectedFunction) {
      const fetchMetrics = async () => {
        try {
          const response = await api.get(`/metrics/function/${selectedFunction}`);
          setMetrics(response.data);
        } catch (error) {
          console.error('Error fetching metrics:', error);
        }
      };
      fetchMetrics();
    }
  }, [selectedFunction]);

  const prepareChartData = () => {
    const data = metrics.map(metric => ({
      timestamp: new Date(metric.timestamp).toLocaleTimeString(),
      executionTime: metric.executionTime,
      technology: metric.technology
    }));
    return data;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Monitoring Dashboard
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Function</InputLabel>
          <Select
            value={selectedFunction}
            onChange={(e) => setSelectedFunction(e.target.value)}
            label="Select Function"
          >
            {functions.map(func => (
              <MenuItem key={func.id} value={func.id}>
                {func.name} ({func.language})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {selectedFunction && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Execution Time by Technology
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareChartData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="executionTime" fill="#8884d8" name="Execution Time (s)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Executions
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Timestamp</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Technology</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Execution Time</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <tr key={index}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {new Date(metric.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{metric.technology}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{metric.executionTime}s</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {metric.success ? (
                          <span style={{ color: 'green' }}>Success</span>
                        ) : (
                          <span style={{ color: 'red' }}>Failed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Dashboard;