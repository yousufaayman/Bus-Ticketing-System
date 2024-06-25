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

module.exports = { getBusSchedules };
