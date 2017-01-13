const express           = require('express');
const router            = express.Router();

const users             = require('../controllers/users');
const authentication    = require('../controllers/authentication');

router.route('/register') //page for registering
  .post(authentication.register);
router.route('/login') // page for login
  .post(authentication.login);

router.route('/users')
  .get(users.index);
router.route('/user/:id') // users page with markers somehow ???
  .get(users.show);

module.exports = router;
