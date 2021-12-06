const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { regex } = require('../utils/validation');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys(
    {
      userId: Joi.string().alphanum().length(24).hex(),
    },
  ),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys(
    {
      name: Joi.string().trim().required().min(2)
        .max(30),
      about: Joi.string().trim().required().min(2)
        .max(30),
    },
  ),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys(
    {
      avatar: Joi.string().trim().required().string()
        .pattern(regex),
    },
  ),
}), updateAvatar);

module.exports = router;
