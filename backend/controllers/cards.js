const { ObjectId } = require('mongodb');
const Card = require('../models/card');
const { CastomizedError, errorCodes, errorMessages } = require('../utils/errors');
const { dataUser } = require('./users');

const dataCard = (card) => ({
  name: card.name,
  link: card.link,
  _id: card._id,
  owner: dataUser(card.owner),
  likes: card.likes.map((user) => dataUser(user)),
  createdAt: card.createdAt,
});

const getCards = (req, res, next) => {
  Card.find({
  }).sort({
    createdAt: -1,
  })
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards.map((card) => dataCard(card))))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => Card.findById(card._id)
      .orFail(() => {
        throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundCard);
      })
      .populate(['owner', 'likes'])
      .then((cardread) => res.send(dataCard(cardread))))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastomizedError(errorCodes.badRequest, err.message));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundCard);
    })
    .then((card) => {
      if (!card.owner._id.equals(new ObjectId(req.user._id))) {
        throw new CastomizedError(errorCodes.forbidden, errorMessages.forbiddenCard);
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({
          message: 'Пост удален',
        }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, {
    new: true,
  })
    .orFail(() => {
      throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundCard);
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(dataCard(card)))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, {
    new: true,
  })
    .orFail(() => {
      throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundCard);
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(dataCard(card)))
    .catch(next);
};

const updateCard = (req, res, next) => {
  const { name } = req.body;
  Card.findByIdAndUpdate(req.params.cardId, {
    name,
  }, {
    new: true, runValidators: true,
  })
    .orFail(() => {
      throw new CastomizedError(errorCodes.notFound, errorMessages.notFoundCard);
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(dataCard(card)))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastomizedError(errorCodes.badRequest, err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
  updateCard,
};
