const { admin } = require('../firebase');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    if (user) {
      return res.status(400).send('User with this email already exists');
    }
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      return res.status(400).send(error.message);
    }
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.status(201).send(userRecord);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(user.uid);
    res.status(200).send({ token: customToken });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
