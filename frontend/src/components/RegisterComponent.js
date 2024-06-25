// src/Register.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
        email,
        password,
      });
      if (response.status === 201) {
        setMessage('User registered successfully, Please proceed to Login.');
        setError('');
      }
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
      setMessage('');
    }
  };

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
      <Typography variant="h5">Register</Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {message && <Typography color="success.main">{message}</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Register
      </Button>
    </Box>
  );
};

export default Register;
