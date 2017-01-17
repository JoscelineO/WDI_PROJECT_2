const User       = require('../models/user');
const Scrapbook  = require('../models/scrapbook');
const Entry      = require('../models/entry');

function entriesCreate(req, res){
  Scrapbook.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(404).json({ error: 'No user was found.' });

    const entry = new Entry(req.body.entry);

    entry.save((err, entry) => {
      if (err) return res.status(500).json(err);

      User.scrapbook.entries.push(entry);

      user.save(err => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(entry);
      });
    });
  });
}

module.exports = {
  create: entriesCreate
};
