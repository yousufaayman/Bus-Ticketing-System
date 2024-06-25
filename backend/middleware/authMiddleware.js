const { admin } = require('../firebase');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

module.exports = verifyToken;
