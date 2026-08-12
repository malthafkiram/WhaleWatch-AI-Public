const bcrypt = require("bcryptjs");

const hash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const compare = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports = { hash, compare };
