const isEmail = require('validator/lib/isEmail');

const isUrl = (str) => {
  const regex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.,~#?&//=!]*$)/;
  return regex.test(str);
};

module.exports = {
  isEmail,
  isUrl,
};
