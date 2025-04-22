import React, { useState, useEffect } from 'react';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

const FunctionList = () => {
  const [functions, setFunctions] = useState([]);

  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        const response = await api.get('/functions');
        setFunctions(response.data);
      } catch (error) {
        console.error('Error fetching functions:', error);
      }
    };
    fetchFunctions();
  }, []);

  return (
    <Container>
      <Button variant="contained" color="primary" component={Link} to="/functions/new" sx={{ mb: 2 }}>
        Create New Function
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {functions.map((func) => (
              <TableRow key={func.id}>
                <TableCell>{func.name}</TableCell>
                <TableCell>{func.route}</TableCell>
                <TableCell>{func.language}</TableCell>
                <TableCell>{func.status}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/functions/${func.id}`} size="small">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FunctionList;