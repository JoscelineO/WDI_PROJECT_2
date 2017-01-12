const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true},
  locations: {}
});

module.exports = mongoose.model('User', userSchema);
