const User       = require('../models/user');
const Scrapbook  = require('../models/scrapbook');
const Entry      = require('../models/entry');

function entriesCreate(req, res){
  Scrapbook.findById(req.params.id, (err, scrapbook) => {
    if (err) return res.status(500).json(err);
    if (!scrapbook) return res.status(404).json({ error: 'No user was found.' });

    const entry = new Entry(req.body);

    entry.save((err, entry) => {
      if (err) return res.status(500).json(err);
      scrapbook.entries.push(entry);

      scrapbook.save(err => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(scrapbook);
      });
    });
  });
}

//could add in update and delete maybe??

module.exports = {
  create: entriesCreate
};
