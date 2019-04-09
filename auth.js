const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 11;
const TOKEN_KEY = 'areallylonggoodkey';

const hashPassword = async (password) => {

}

const checkPassword = async (password, password_digest) => {

}


const genToken = (user) => {

};


const restrict = (req, res, next) => {

}

module.exports = {
  hashPassword,
  checkPassword,
  genToken,
  restrict,
};
