const mongoose = require('mongoose');

const scrapbookSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  location: { type: String, trim: true, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  entries: [{ type: mongoose.Schema.ObjectId, ref: 'Entry' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Scrapbook', scrapbookSchema);
