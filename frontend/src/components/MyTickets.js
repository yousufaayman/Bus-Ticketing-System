// src/MyTickets.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Paper, Box, Button } from '@mui/material';
import { useAuth } from './useAuth';

const MyTickets = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (currentUser && currentUser.email) {
        try {
          console.log("Fetching tickets for email:", currentUser.email);
          const ticketsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tickets`, {
            params: { email: currentUser.email }
          });
          const ticketData = ticketsResponse.data;

          const busSchedules = await Promise.all(
            ticketData.map(async (ticket) => {
              const scheduleResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/bus-schedules/${ticket.tripId}`);
              return {
                ...scheduleResponse.data,
                seatNumber: ticket.seatNumber
              };
            })
          );

          setTickets(busSchedules);
        } catch (error) {
          console.error("Error fetching tickets:", error);
        }
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentUser]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>My Tickets</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper className="tickets-list">
          <List>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => {
                const tripTime = new Date(ticket.date._seconds * 1000).toLocaleString();
                return (
                  <ListItem key={index} className="ticket-item">
                    <ListItemText
                      primary={`${ticket.source} to ${ticket.destination} at ${tripTime}`}
                      secondary={`Seat Number: ${ticket.seatNumber}`}
                    />
                  </ListItem>
                );
              })
            ) : (
              <Typography variant="h6">No tickets found</Typography>
            )}
          </List>
        </Paper>
      )}
      <Button onClick={onClose} color="primary" variant="contained">Close</Button>
    </Container>
  );
};

export default MyTickets;
