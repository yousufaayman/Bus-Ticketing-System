import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import BusSchedule from '../components/BusSchedule';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>Dashboard</Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleLogout} 
          sx={{ mb: 2 }}
        >
          Logout
        </Button>
        <BusSchedule />
      </Box>
    </Container>
  );
};

export default Dashboard;
