const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const path = require('path');

const { PORT, BASE_LOCATION } = require('./utils/constants');
const { CastomizedError, errorCodes, errorMessages } = require('./utils/errors');
const routes = require('./routes');

mongoose.connect(`mongodb:${BASE_LOCATION}`);

const app = express();

app.use('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.all('/*', () => {
  throw new CastomizedError(errorCodes.notFound, errorMessages.urlNotFound);
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Произошла непредвиденная ошибка на сервере.' } = err;
  return res.status(statusCode).send({
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server has been listening on port ${PORT}`);
});
