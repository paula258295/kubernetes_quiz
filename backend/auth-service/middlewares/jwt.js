const jwt = require('jsonwebtoken');


function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired',
        expiredAt: err.expiredAt,
      });
    }
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
}


function requireRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
  };
}

module.exports = auth;
module.exports.requireRole = requireRole;
