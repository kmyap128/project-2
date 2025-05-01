const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  songs: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Song',
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

PlaylistSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  songs: doc.songs,
});

const PlaylistModel = mongoose.model('Playlist', PlaylistSchema);
module.exports = PlaylistModel;
