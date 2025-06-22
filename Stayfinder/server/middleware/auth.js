const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const hostMiddleware = (req, res, next) => {
  if (req.user.role !== 'host') {
    return res.status(403).json({ message: 'Host access required' });
  }
  next();
};

module.exports = { authMiddleware, hostMiddleware };