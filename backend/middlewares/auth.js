const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { CastomizedError, errorCodes, errorMessages } = require('../utils/errors');

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new CastomizedError(errorCodes.unauthorized, errorMessages.badToken);
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new CastomizedError(errorCodes.unauthorized, errorMessages.badToken);
  }

  req.user = payload;

  next();
};

module.exports = auth;
