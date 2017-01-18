const mongoose   = require('mongoose');
const Promise    = require('bluebird');
const async      = require('async');
mongoose.Promise = Promise;
const config     = require('../config/config');

// Require Models
const User       = require('../models/user');
const Scrapbook  = require('../models/scrapbook');
const Entry      = require('../models/entry');

// Connect to DB
mongoose.connect(config.db);

// Delete everything
User.collection.drop();
Scrapbook.collection.drop();
Entry.collection.drop();

// done is a function that will jump to the end if the first argument is not
// null as the first argument is always an error.
// e.g. done(true) => would go to the end
// e.g. done(null) => would go to the next function
async.waterfall([
  function CreateUser(done) {
    const user = new User({
      username: 'Jos',
      email: 'jos@jos.com',
      firstName: 'Jos',
      lastName: 'JOSSSSS',
      password: 'password',
      passwordConfirmation: 'password'
    });
    user
      .save((err, user) => {
        if (err) return done(err);
        console.log(`${user.username} was saved!`);
        return done(null, user);
      });
  }, function CreateScrapbook(user, done) {
    const scrapbook1 = new Scrapbook({
      title: 'Jos\'s trip with Davinder to Japan...',
      description: 'Going to Japan. Doing Japanese things. Coming back.',
      location: 'Japan',
      lat: 35.726545,
      lng: 139.729698
    });
    scrapbook1.save((err, scrapbook) => {
      if (err) return done(err);
      console.log(`${scrapbook.title} was created!`);
      return done(null, user, scrapbook);
    });
  }, function AddScrapbookToUser(user, scrapbook, done) {
    // addToSet is like push but if it already exists... it won't
    user.scrapbooks.addToSet(scrapbook);
    user.save((err, user) => {
      if (err) return done(err);
      console.log(`${scrapbook.title} was added to ${user.username}`);
      return done(null, scrapbook);
    });
  }, function CreateEntries(scrapbook, done) {
    const entries = [
      {
        title: 'Sang a bit. Drank a lot.',
        description: 'First night in town...',
        location: 'Wallflowers Bar',
        lat: 35.659523,
        lng: 139.723487
      },
      {
        title: 'Shrineage.',
        description: 'So zen. Much instagramz.',
        location: 'Meiji Jingu',
        lat: 35.678135,
        lng: 139.699455
      },
      {
        title: 'A whole new world.',
        description: 'Imperial Palace init.',
        location: 'Imperial Palace',
        lat: 35.684898,
        lng: 139.752756
      }
    ];
    Entry
      .create(entries, (err, entries) => {
        if (err) return done(err);
        entries.forEach(entry => {
          console.log(`${entry.title} was saved!`);
        });
        return done(null, scrapbook, entries);
      });
  }, function AddEntriesToScrapbook(scrapbook, entries, done) {
    entries.forEach(entry => {
      scrapbook.entries.addToSet(entry);
    });

    scrapbook.save((err, scrapbook) => {
      if (err) return done(err);
      console.log(`${scrapbook.title} was updated!`);
      return done(null);
    });
  }
], function (err) {
  if (err) return console.log(err);
  console.log('Finished!');
  return process.exit();
});
