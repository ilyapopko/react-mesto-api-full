const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CastomizedError, errorCodes, errorMessages } = require('../utils/errors');

const dataUser = (user) => ({
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  email: user.email,
  _id: user._id,
});

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', {
        expiresIn: '7d',
      });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }).send({
        token,
        user: dataUser(user),
      });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
      .send({
        message: 'Вы вышли из профиля',
      });
  } catch (err) {
    next(err);
  }
};

const getUsers = (req, res, next) => {
  User.find({
  })
    .then((users) => res.send(users.map((user) => dataUser(user))))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundUser);
    })
    .then((user) => res.send(dataUser(user)))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundUser);
    })
    .then((user) => res.send(dataUser(user)))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      password: hash, email, name, about, avatar,
    }))
    .then((user) => res.send(dataUser(user)))
    .catch((err) => {
      if (err.code === 11000) {
        next(new CastomizedError(errorCodes.conflict, errorMessages.conflictEmail));
      } else if (err.name === 'ValidationError') {
        next(new CastomizedError(errorCodes.badRequest, err.message));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name, about,
  }, {
    new: true, runValidators: true,
  })
    .orFail(() => {
      throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundUser);
    })
    .then((user) => res.send(dataUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastomizedError(errorCodes.badRequest, err.message));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    avatar,
  }, {
    new: true, runValidators: true,
  })
    .orFail(() => {
      throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundUser);
    })
    .then((user) => res.send(dataUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastomizedError(errorCodes.badRequest, err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  dataUser,
  login,
  getCurrentUser,
  logout,
};
