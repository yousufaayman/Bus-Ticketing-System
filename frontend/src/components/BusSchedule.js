// src/BusSchedule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, List, ListItem, ListItemText, CircularProgress, Box, Paper, Button, Modal, Grid, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from './useAuth';  // Assuming you have a useAuth hook to get the authenticated user
import CloseIcon from '@mui/icons-material/Close';  // Importing the Close icon
import '../assets/styles/BusSchedule.css';

const BusSchedule = () => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState(new Date());
  const [busSchedules, setBusSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);
  const [booking, setBooking] = useState(false);

  const fetchBusSchedules = async (selectedDate) => {
    setLoading(true);
    try {
      const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bus-schedules`, {
        params: { date: localDate }
      });
      setBusSchedules(response.data);
    } catch (error) {
      console.error("Error fetching bus schedules:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBusSchedules(date);
  }, [date]);

  const handleOpen = (trip) => {
    setSelectedTrip(trip);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmationOpen(false);
    setSelectedSeatIndex(null);
  };

  const handleConfirmOpen = (seatIndex) => {
    setSelectedSeatIndex(seatIndex);
    setConfirmationOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmationOpen(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' };
    const time = date.toLocaleTimeString([], options);
    return time;
  };

  const bookSeat = async () => {
    console.log("Booking seat...");
    console.log("Selected trip:", selectedTrip);
    console.log("Selected seat index:", selectedSeatIndex);
    console.log("Current user:", currentUser);
    if (selectedTrip && selectedSeatIndex !== null && currentUser && currentUser.email) {
      console.log("Current user email:", currentUser.email);
      setBooking(true);
      try {
        console.log("Making API request to book seat...");
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/book-seat`, {
          tripId: selectedTrip.id,
          seatIndex: selectedSeatIndex,
          userEmail: currentUser.email,
        });
        fetchBusSchedules(date);
        handleClose();
      } catch (error) {
        console.error("Error booking seat:", error);
      } finally {
        setBooking(false);
      }
    } else {
      console.error("Booking conditions not met.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Bus Schedules</Typography>
      <Box sx={{ mb: 2 }}>
        <Calendar
          onChange={setDate}
          value={date}
          className="calendar"
        />
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper className="schedule-list">
          <List>
            {busSchedules.length > 0 ? (
              busSchedules.map(schedule => {
                const availableSeats = schedule.seats.filter(seat => seat).length;
                const tripTime = schedule.date && schedule.date._seconds
                  ? formatTime(schedule.date)
                  : 'Invalid Time';
                return (
                  <ListItem key={schedule.id} className="schedule-item">
                    <ListItemText
                      primary={`${schedule.source} to ${schedule.destination} at ${tripTime}`}
                      secondary={`Seats available: ${availableSeats}`}
                    />
                    <Button variant="contained" onClick={() => handleOpen(schedule)}>Book Seat</Button>
                  </ListItem>
                );
              })
            ) : (
              <Typography variant="h6">No trips available for the selected date</Typography>
            )}
          </List>
        </Paper>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Paper sx={{ p: 4, position: 'relative' }}>
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
            <Typography variant="h6">Select a Seat</Typography>
            {selectedTrip && (
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {selectedTrip.seats.map((seat, index) => (
                  <Grid item xs={4} key={index}>
                    <Button
                      variant="contained"
                      onClick={() => handleConfirmOpen(index)}
                      disabled={!seat}
                      sx={{
                        backgroundColor: !seat ? 'red' : 'green',
                        color: 'white',
                        cursor: !seat ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {`Seat ${index + 1}`}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Box>
      </Modal>

      <Dialog open={confirmationOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to book Seat {selectedSeatIndex + 1} on the trip from {selectedTrip?.source} to {selectedTrip?.destination} at {selectedTrip && formatTime(selectedTrip.date)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">Cancel</Button>
          <Button onClick={bookSeat} color="primary" disabled={booking}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BusSchedule;
