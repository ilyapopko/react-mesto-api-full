const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { regex } = require('../utils/validation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
  updateCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys(
    {
      name: Joi.string().trim().required().min(2)
        .max(30),
      link: Joi.string().trim().required().string()
        .pattern(regex),
    },
  ),
}), createCard);

router.patch('/:cardId', celebrate({
  params: Joi.object().keys(
    {
      cardId: Joi.string().alphanum().length(24).hex(),
    },
  ),
  body: Joi.object().keys(
    {
      name: Joi.string().trim().required().min(2)
        .max(30),
    },
  ),
}), updateCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys(
    {
      cardId: Joi.string().alphanum().length(24).hex(),
    },
  ),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys(
    {
      cardId: Joi.string().alphanum().length(24).hex(),
    },
  ),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys(
    {
      cardId: Joi.string().alphanum().length(24).hex(),
    },
  ),
}), dislikeCard);

module.exports = router;
