const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

const { registerUser, loginUser } = require('./controllers/authContoller.js');

app.use(bodyParser.json());
app.use(cors());

app.post('/register', registerUser);
app.post('/login', loginUser);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
