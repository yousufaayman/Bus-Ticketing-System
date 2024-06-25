const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

const { registerUser, loginUser } = require('./controllers/authController');
const {getBusSchedules, bookSeat, getTicketsByEmail, getBusScheduleById } = require('./controllers/busScheduleController');

app.use(bodyParser.json());
app.use(cors());

app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/bus-schedules', getBusSchedules);
app.post('/book-seat', bookSeat);
app.get('/tickets', getTicketsByEmail);
app.get('/bus-schedules/:id', getBusScheduleById);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
