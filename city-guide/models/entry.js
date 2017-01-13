const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true },
  location: { type: String, trim: true, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Entry', entrySchema);
