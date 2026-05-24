const constants = require('../../../config/constants');

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== constants.ROLES.ADMIN) {
    return res.status(403).json({ error: 'Access forbidden' });
  }
  next();
};

module.exports = adminMiddleware;
