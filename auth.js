const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 11;
const TOKEN_KEY = 'areallylonggoodkey';

const hashPassword = async (password) => {
  const digest = await bcrypt.hash(password, SALT_ROUNDS);
  return digest;
}

const checkPassword = async (password, password_digest) => {
  return await bcrypt.compare(password, password_digest);
}

const genToken = (user) => {
  const token_data = {
    id: user.id,
    name: user.name,
    email: user.email
  };
  const token = jwt.sign(token_data, TOKEN_KEY);
  return token;
};

const restrict = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, TOKEN_KEY);
    res.locals.user = data;
    next();
  } catch (e) {
    console.log(e);
    res.status(403).send('Unauthorized');
  }
}

module.exports = {
  hashPassword,
  checkPassword,
  genToken,
  restrict,
};
