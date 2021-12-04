const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

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
      link: Joi.string().trim().uri().required(),
    },
  ),
}), createCard);

router.patch('/:cardId', celebrate({
  params: Joi.object().keys(
    {
      cardId: Joi.string().alphanum().length(24),
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
      cardId: Joi.string().alphanum().length(24),
    },
  ),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys(
    {
      cardId: Joi.string().alphanum().length(24),
    },
  ),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys(
    {
      cardId: Joi.string().alphanum().length(24),
    },
  ),
}), dislikeCard);

module.exports = router;
