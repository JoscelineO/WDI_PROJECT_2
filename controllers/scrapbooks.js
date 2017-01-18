const User      = require('../models/user');
const Scrapbook = require('../models/scrapbook');

// Create Scrapbook
function scrapbooksCreate(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(404).json({ error: 'No user was found.' });

    const scrapbook = new Scrapbook(req.body);

    scrapbook.save((err, scrapbook) => {
      if (err) return res.status(500).json(err);

      user.scrapbooks.push(scrapbook);

      user.save(err => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(scrapbook);
      });
    });
  });
}

// could add in update and delete maybe??

module.exports = {
  create: scrapbooksCreate
};
