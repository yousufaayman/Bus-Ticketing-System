import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Box, Paper } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../assets/styles/BusSchedule.css';

const BusSchedule = () => {
  const [date, setDate] = useState(new Date());
  const [busSchedules, setBusSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBusSchedules = async (selectedDate) => {
    setLoading(true);
    try {
      const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      console.log('Local date:', localDate);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bus-schedules`, {
        params: { date: localDate }
      });
      setBusSchedules(response.data);
    } catch (error) {
      console.error("Error fetching bus schedules: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBusSchedules(date);
  }, [date]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' };
    const time = date.toLocaleTimeString([], options);
    return time;
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
                  </ListItem>
                );
              })
            ) : (
              <Typography variant="h6">No trips available for the selected date</Typography>
            )}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default BusSchedule;
