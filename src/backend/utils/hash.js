const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const isValidPassword = (password) => {
  return password && password.length >= 6;
};

module.exports = {
  hashPassword,
  comparePassword,
  isValidPassword
};
