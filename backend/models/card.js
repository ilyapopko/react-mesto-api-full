const mongoose = require('mongoose');
const validator = require('../utils/validation');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" обязательно для заполнения.'],
    minlength: [2, 'Поле "name" должно быть не менее 2 символов.'],
    maxlength: [30, 'Поле "name" должно быть не более 30 символов.'],
  },
  link: {
    type: String,
    required: [true, 'Поле "link" обязательно для заполнения.'],
    validate: {
      validator: validator.isUrl,
      message: 'Поле "link" не соответствует правилам составления url',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
