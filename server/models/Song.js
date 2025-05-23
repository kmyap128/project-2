const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  artist: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  link: {
    type: String,
    required: false, // for profit model
    trim: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

SongSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  artist: doc.artist,
  link: doc.link,
});

const SongModel = mongoose.model('Song', SongSchema);
module.exports = SongModel;
