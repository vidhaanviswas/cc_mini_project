import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, TextField, Typography, Paper, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../services/api';

const FunctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [func, setFunc] = useState({
    name: '',
    route: '',
    language: 'javascript',
    code: '',
    timeout: 10,
    status: 'active'
  });
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (id !== 'new') {
      const fetchFunction = async () => {
        try {
          const response = await api.get(`/functions/${id}`);
          setFunc(response.data);
        } catch (error) {
          console.error('Error fetching function:', error);
        }
      };
      fetchFunction();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id === 'new') {
        await api.post('/functions', func);
      } else {
        await api.put(`/functions/${id}`, func);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving function:', error);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const response = await api.post(`/functions/${id}/execute`, { input });
      setOutput(response.data.output || response.data.error);
    } catch (error) {
      setOutput(error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Container>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {id === 'new' ? 'Create Function' : 'Edit Function'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={func.name}
            onChange={(e) => setFunc({ ...func, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Route"
            value={func.route}
            onChange={(e) => setFunc({ ...func, route: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Language</InputLabel>
            <Select
              value={func.language}
              onChange={(e) => setFunc({ ...func, language: e.target.value })}
              label="Language"
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Timeout (seconds)"
            type="number"
            value={func.timeout}
            onChange={(e) => setFunc({ ...func, timeout: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Code"
            value={func.code}
            onChange={(e) => setFunc({ ...func, code: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={10}
            required
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            {id !== 'new' && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/')}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {id !== 'new' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Execute Function
          </Typography>
          <TextField
            label="Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleExecute}
            disabled={isExecuting}
            sx={{ mt: 2 }}
          >
            {isExecuting ? 'Executing...' : 'Execute'}
          </Button>
          {output && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Output:</Typography>
              <Paper sx={{ p: 2, mt: 1, backgroundColor: '#1e1e1e' }}>
                <pre style={{ margin: 0 }}>{output}</pre>
              </Paper>
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default FunctionDetail;