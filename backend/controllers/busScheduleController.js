const { db } = require('../firebase');

const getBusSchedules = async (req, res) => {
  const { date } = req.query;
  let query = db.collection('busSchedules');

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    console.log('Start of day:', startOfDay.toISOString());
    console.log('End of day:', endOfDay.toISOString());
    query = query.where('date', '>=', startOfDay).where('date', '<=', endOfDay);
  }

  try {
    const snapshot = await query.get();
    const busSchedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Bus schedules:', busSchedules);
    res.json(busSchedules);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const bookSeat = async (req, res) => {
  const { tripId, seatIndex, userEmail } = req.body;

  try {
    console.log("Booking seat:", { tripId, seatIndex, userEmail });
    const tripRef = db.collection('busSchedules').doc(tripId);
    const tripDoc = await tripRef.get();
    if (!tripDoc.exists) {
      console.log("Trip not found:", tripId);
      return res.status(404).send('Trip not found');
    }

    const tripData = tripDoc.data();
    if (!tripData.seats[seatIndex]) {
      console.log("Seat already booked:", seatIndex);
      return res.status(400).send('Seat already booked');
    }

    const existingBookingSnapshot = await db.collection('BusTickets')
      .where('tripId', '==', tripId)
      .where('seatNumber', '==', seatIndex + 1)
      .where('userEmail', '==', userEmail)
      .get();

    if (!existingBookingSnapshot.empty) {
      console.log("Seat already booked by user:", { tripId, seatIndex, userEmail });
      return res.status(400).send('You have already booked this seat');
    }

    tripData.seats[seatIndex] = false;
    await tripRef.update({ seats: tripData.seats });

    await db.collection('BusTickets').add({
      userEmail,
      tripId,
      seatNumber: seatIndex + 1
    });

    console.log("Seat booked successfully:", { tripId, seatIndex, userEmail });
    res.send('Seat booked successfully');
  } catch (error) {
    console.error("Error booking seat:", error.message);
    res.status(500).send(error.message);
  }
};

const getTicketsByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const ticketsSnapshot = await db.collection('BusTickets').where('userEmail', '==', email).get();
    const tickets = ticketsSnapshot.docs.map(doc => doc.data());
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).send(error.message);
  }
};

const getBusScheduleById = async (req, res) => {
  const { id } = req.params;

  try {
    const scheduleDoc = await db.collection('busSchedules').doc(id).get();
    if (!scheduleDoc.exists) {
      return res.status(404).send('Bus schedule not found');
    }
    res.json(scheduleDoc.data());
  } catch (error) {
    console.error("Error fetching bus schedule:", error);
    res.status(500).send(error.message);
  }
};

module.exports = { getBusSchedules, bookSeat, getTicketsByEmail, getBusScheduleById };
