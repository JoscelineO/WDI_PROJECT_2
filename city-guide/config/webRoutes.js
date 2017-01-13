const express           = require('express');
const router            = express.Router();

const staticsController = require('../controllers/statics');

router.route('/')  // a map!!!
  .get(staticsController.home);

module.exports = router;
