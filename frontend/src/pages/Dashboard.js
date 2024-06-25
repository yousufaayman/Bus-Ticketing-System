// src/Dashboard.js
import React, { useState } from 'react';
import { Container, Typography, Box, Button, Modal, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import BusSchedule from '../components/BusSchedule';
import MyTickets from '../components/MyTickets';
import CloseIcon from '@mui/icons-material/Close';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3">Dashboard</Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleLogout} 
        >
          Logout
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" mb={4}>
        <Button onClick={handleOpen} variant="contained" color="primary">
          My Tickets
        </Button>
      </Box>
      <Box>
        <BusSchedule />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Paper sx={{ position: 'relative', padding: 4, maxWidth: '600px', width: '100%' }}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <MyTickets onClose={handleClose} />
          </Paper>
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;
