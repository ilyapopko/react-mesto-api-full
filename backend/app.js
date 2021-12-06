require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { CastomizedError, errorCodes, errorMessages } = require('./utils/errors');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use('*', cors({
  origin: [
    /^https?:\/\/mesto-ilyap.students.nomoredomains.rocks/,
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.all('/*', () => {
  throw new CastomizedError(errorCodes.notFound, errorMessages.urlNotFound);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message = 'Произошла непредвиденная ошибка на сервере.' } = err;
  return res.status(statusCode).send({
    message,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server has been listening on port ${PORT}`);
});
