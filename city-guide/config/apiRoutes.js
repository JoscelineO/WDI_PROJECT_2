const express = require('express');
const router  = express.Router();

// MongooseError: Schema hasn't been registered for model ?!!!!!
const User      = require('../models/user');
const Entry     = require('../models/entry');
const Scrapbook = require('../models/scrapbook');

// Require controllers
const users          = require('../controllers/users');
const authentication = require('../controllers/authentication');

// Page for registering
router.route('/register')
  .post(authentication.register);

// Page for login
router.route('/login')
  .post(authentication.login);

// List of all users
router.route('/users')
  .get(users.index);
router.route('/user/:id')
  .get(users.show);

module.exports = router;
