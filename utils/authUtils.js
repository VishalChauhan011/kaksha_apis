// authUtils.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generic function to encrypt the password before saving user
async function encryptPassword(data) {
  if (!data.isModified('password')) {
    return;
  }
  data.password = await bcrypt.hash(data.password, 10);
}

// Generic function to validate the password with the passed-on user password
async function validatePassword(user, password) {
  return await bcrypt.compare(password, user.password);
}

// Generic function to create and return jwt token
function getJwtToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
}

module.exports = {
  encryptPassword,
  validatePassword,
  getJwtToken,
};
