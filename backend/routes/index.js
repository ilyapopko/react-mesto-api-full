const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regex } = require('../utils/validation');

const auth = require('../middlewares/auth');
const { login, logout, createUser } = require('../controllers/users');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.post('/signin', celebrate({
  body: Joi.object().keys(
    {
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().required(),
    },
  ),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys(
    {
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().required(),
      name: Joi.string().trim().min(2).max(30),
      about: Joi.string().trim().min(2).max(30),
      avatar: Joi.string().trim().string().pattern(regex),
    },
  ),
}), createUser);

router.get('/signout', logout);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

module.exports = router;
