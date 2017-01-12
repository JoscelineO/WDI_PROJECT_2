const express           = require('express');
const router            = express.Router();
const staticsController = require('../controllers/statics');
const users          = require('../controllers/users'); //??
const authentication    = require('../controllers/authentication');

router.route('/')  // a map!!!
  .get(staticsController.home);

router.route('/register') //model for registering
  .post(authentication.register);
router.route('/login') // model for login
  .post(authentication.login);

router.route('/users')
  .get(users.index);
router.route('/user/:id') // users page with markers somehow ???
  .get(users.show);
