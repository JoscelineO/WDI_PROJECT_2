const mongoose    = require('mongoose');
const config      = require('../config/config');
const User        = require('../models/user');

mongoose.connect(config.db);

User.collection.drop();

const user1 = new User({
  username: 'Kenny',
  password: 'password',
  passwordConfirmation: 'password'
});

user1.save((err, user) => {
  if (err) return console.log(err);
  return console.log(`${user} was saved`);
});

// for (var i = 0; i < users.length; i++) {
//   users[i].create((err, user) => {
//     if (err) return console.log(err);
//     return console.log(`${user} was saved`);
//   });
// }
// users.forEach ((user) => {
//   User.create((err, user) => {
//     if (err) return console.log(err);
//     return console.log(`${user} was saved`);
//   });
// }
