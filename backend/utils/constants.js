const { PORT = 3000 } = process.env;
const { BASE_LOCATION = '//localhost:27017/mestodb' } = process.env;

const SECRET_KEY = 'some-secret-key';

const defaultUserValues = {
  name: 'Жак-Ив Кусто',
  about: 'Исследователь',
  avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
};

module.exports = {
  PORT,
  BASE_LOCATION,
  SECRET_KEY,
  defaultUserValues,
};
