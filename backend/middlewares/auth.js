const jwt = require('jsonwebtoken');
const { CastomizedError, errorCodes, errorMessages } = require('../utils/errors');
const { SECRET_KEY } = require('../utils/constants');

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new CastomizedError(errorCodes.unauthorized, errorMessages.badToken);
  }

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new CastomizedError(errorCodes.unauthorized, errorMessages.badToken);
  }

  req.user = payload;

  next();
};

module.exports = auth;
